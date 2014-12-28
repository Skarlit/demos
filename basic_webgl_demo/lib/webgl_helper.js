var WebGLHelper = (function (lib) {
    lib.createGLContext = function (canvas) {
        var names = ['webgl', 'experimental-webgl'];
        var gl = null;
        for (var i = 0; i < names.length; i++) {
            try {
                gl = canvas.getContext(names[i]);
            } catch(e) {}
            if (gl) {
                break;
            }
        }
        if (gl) {
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } else {
            console.log('Failed to create WebGL context.');
        }
        return gl;
    }
    
    lib.loadShaderFromDOM = function(id, gl) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) { 
            console.log('No DOM element found.');
        }

        var shaderSource = '';
        var currentChild = shaderScript.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) { // 3 means TEXT_NODE
                shaderSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }

        var shader;
        if (shaderScript.type == 'x-shader/x-fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    lib.createShaderProgram = function(fs, vs, gl) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vs);
        gl.attachShader(shaderProgram, fs);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    }

    lib.createVB = function(vertices, gl, itemSize) {
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexBuffer.itemSize = itemSize;
        vertexBuffer.numberOfItems = parseInt(vertices.length / itemSize);
        return vertexBuffer;
    }

    return lib;

}(WebGLHelper || {}));