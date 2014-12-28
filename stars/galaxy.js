(function(root){

	var Galaxy  = root.Galaxy = function(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, root.innerWidth / root.innerHeight, 0.01, 1000);
		this.objs = [];
		this.frameRate = 1;
		this.frameCounter = 0;
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.clock = new THREE.Clock;
		this.particles = new THREE.Geometry;
		this.meteors = [];
	}

	Galaxy.prototype.addSun = function() {
		var sunGeometry = new THREE.SphereGeometry(50, 32, 32);
		var sunTexture = THREE.ImageUtils.loadTexture('./sun_surface.jpg');
		sunTexture.mapping = THREE.SphericalReflectionMapping;
		var material = new THREE.MeshPhongMaterial({emissive: 0xffffff, map: sunTexture});
		this.sun = new THREE.Mesh(sunGeometry, material);
	};

	Galaxy.prototype.meteor = function() {
		var material = new THREE.LineBasicMaterial({ color: 0xeeeeee }); 
		var geometry = new THREE.Geometry(); 
		geometry.vertices.push( new THREE.Vector3( 0, -100, 0 ) ); 
		geometry.vertices.push( new THREE.Vector3( 0, 100, 0) ); 
		var line = new THREE.Line( geometry, material);
		line.rotation.z += 1*(Math.random() - 0.5);
		line.translateY(200*(Math.random() - 0.5));
		line.translateX(900*(Math.random() - 0.5));
		line.translateZ(900*(Math.random() - 0.5))
		line.lifeSpan = (Math.floor(Math.random()* 2)) * 60 / this.frameRate;
		this.meteors.push(line);
		this.scene.add(line);
	};

	Galaxy.prototype.init = function() {
		this.renderer.setSize(root.innerWidth, root.innerHeight);
		document.body.appendChild(this.renderer.domElement);


		for( var p = 0; p < 3000; p++){
			var particle = new THREE.Vector3(
				Math.random() * 500 - 250, 
				Math.random() * 200 - 100, 
				Math.random() * 500 - 250
			)
			this.particles.vertices.push(particle);
			if(Math.random()< 0.2){
			  this.particles.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
			}else{
				this.particles.colors.push(new THREE.Color(1,1,1));
			}
		}

		var particleTexture = THREE.ImageUtils.loadTexture('./drop.png');
		var particleMaterial = new THREE.ParticleBasicMaterial({map: particleTexture, size: 2, vertexColors: true});

		this.particleSystem = new THREE.ParticleSystem(this.particles, particleMaterial);


		this.scene.add(this.particleSystem);
	

		this.camera.position.z = 5;
	};

	Galaxy.prototype.render = function() {
		requestAnimationFrame(this.render.bind(this));
		if(this.frameCounter > this.frameRate){
			this.frameCounter = 0;
      this.renderer.render(this.scene, this.camera); 
      this.update();
    }
    this.frameCounter += 1;
	};


	Galaxy.prototype.update = function() {

		this.camera.rotation.y += 0.001;

		
		if(Math.random() < 0.2){
			this.meteor();
		}

		for(var i =0; i < this.meteors.length; i++){
			this.meteors[i].translateY(200);
			this.meteors[i].lifeSpan -= 1;
			if(this.meteors[i].lifeSpan < 0){
				this.scene.remove(this.meteors[i]);
			}
		}
	};


var mrain = new Galaxy();
mrain.init();
mrain.render();



})(this);