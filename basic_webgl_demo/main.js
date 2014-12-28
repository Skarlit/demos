(function(root) {
    
    var gl;
    var vbo;
    var shaderProgram;
    var vertices;
    var size = 30;
    var strips;
    var pMatrix = mat4.create();

    function initContext(id) {
        gl = WebGLHelper.createGLContext(document.getElementById(id));
    }

    function initShader() {
        var vShader = WebGLHelper.loadShaderFromDOM('shader-vs', gl);
        var fShader = WebGLHelper.loadShaderFromDOM('shader-fs', gl);
        shaderProgram = WebGLHelper.createShaderProgram(fShader,vShader,gl);
        gl.useProgram(shaderProgram);

        shaderProgram.vPosAttr = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vPosAttr);

        shaderProgram.luminAttr = gl.getAttribLocation(shaderProgram, "luminosity");
        gl.enableVertexAttribArray(shaderProgram.luminAttr);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
    }

    function initVBO() {
        vertices = [];
        for(var i = 0; i < size; i++) {
            vertices.push(0);
            vertices.push((size/2 - i) / 5);
            vertices.push(0);
        }
        vbo = WebGLHelper.createVB(vertices, gl, 3);
    }

    var normalization = Math.exp(1) - 1;
    function lumin(t, index, stride) {
        return (index > t ? 0 : 1-(t - index)/stride);
    }

    function Strip() {
        this.luminosity = [];
        this.t = parseInt(size*Math.random());
        this.stride = 20;
        for(var i = 0; i < size; i++) {
            this.luminosity.push(0);
        }
        this.luminosity[this.t] = 1;
        this.timeElapsed = 0;
        this.modelMatrix = mat4.create();
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, [7*Math.random() - 3.5, 7*Math.random() - 3.5, -7.0])
        this.luminosityBuffer = WebGLHelper.createVB(this.luminosity, gl, 1);
    }

    Strip.prototype.updateLumin = function() {
        if (this.timeElapsed < this.stride) {
            for (var i = 0; i < size; i++) {
                this.luminosity[i] = 0;
            }
            for (var i = this.t - this.timeElapsed; i <= this.t; i++) {
                this.luminosity[i] = lumin(this.t, i, this.stride);
            }
        } else {
            for(var i = 0; i < size; i++) {
                this.luminosity[i] = lumin(this.t, i, this.stride);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.luminosityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.luminosity), gl.STATIC_DRAW);
    };

    function initWorld (count) {
        strips = []
        for(var i = 0;i < count; i++) {
            strips[i] = new Strip();
        }
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

        for(var i = 0; i < strips.length; i++) {
            gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, strips[i].modelMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(shaderProgram.vPosAttr, vbo.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, strips[i].luminosityBuffer);
            gl.vertexAttribPointer(shaderProgram.luminAttr, strips[i].luminosityBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, vbo.numberOfItems);
        }
    }

    frame = 0;
    slowFactor = 5;
    function animate() {
        window.requestAnimationFrame(animate);
        if (frame > slowFactor) {
            drawScene();
            for(var i =0; i < strips.length; i++) {
                if(strips[i].t < 2*size) {
                    strips[i].updateLumin();
                    strips[i].t = (strips[i].t + 1);
                    strips[i].timeElapsed += 1;
                } else {
                    strips[i].t = parseInt(size*Math.random());
                    mat4.identity(strips[i].modelMatrix);
                    mat4.translate(strips[i].modelMatrix, [7*Math.random() - 3.5, 0.0, -7.0])
                    strips[i].timeElapsed = 0;
                }
            }
            frame = 0;
        }
        frame += 1;
    }

    function main(canvasId, size) {
        initContext(canvasId);
        initShader();
        initVBO();
        initWorld(50);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        animate();
    }

    main('background');
}(window));