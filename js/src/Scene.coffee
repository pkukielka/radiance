class Scene
	constructor: (@scaleFactor) ->
		container = document.createElement('div');
		document.body.appendChild(container);

		if !Detector.webgl then Detector.addGetWebGLMessage()

		@camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3 * @scaleFactor)
		@camera.position.z = @scaleFactor / 2

		@scene = new THREE.Scene()
		@scene.fog = new THREE.FogExp2(0x000000, 0.0011)
		@scene.add(@camera)

		@renderer = new THREE.WebGLRenderer(clearColor: 0x000000, clearAlpha: 1, antialias: false)
		@renderer.setSize(window.innerWidth, window.innerHeight)

		@stats = new Stats()
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.top = '5px'
		@stats.domElement.style.left = '5px'

		container.appendChild(@renderer.domElement)
		container.appendChild(@stats.domElement)

		hopalong = new Hopalong()
		orbit = hopalong.createOrbit(1000, 20, 10000)
		@setUpScene(orbit)

	animate: =>
		requestAnimationFrame(@animate)
		@renderer.render(@scene, @camera)
		@stats.update()
		
	setUpScene: (orbit) ->
		@camera.lookAt(@scene.position)

		sprite = THREE.ImageUtils.loadTexture("img/galaxy.png")

		for subset, i in orbit
			geometry = new THREE.Geometry();
			geometry.vertices = subset
			material = new THREE.ParticleBasicMaterial(size: 10, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true)
			material.color.setHSV(Math.random(), 0.7, 1)
			particles = new THREE.ParticleSystem(geometry, material)
			particles.position.x = 0
			particles.position.y = 0
			particles.position.z = -200 * i
			particles.needsUpdate = 0
			@scene.add(particles)	