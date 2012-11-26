class Scene
	constructor: ->
		container = document.createElement('div');
		document.body.appendChild(container);

		if !Detector.webgl then Detector.addGetWebGLMessage()

		@camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
		@camera.lookAt(new THREE.Vector3(0, 0, 10))

		@scene = new THREE.Scene()
		@scene.fog = new THREE.FogExp2(0x000000, 0.0011)

		@renderer = new THREE.WebGLRenderer(clearColor: 0x000000, clearAlpha: 1, antialias: false)
		@renderer.setSize(window.innerWidth, window.innerHeight)

		@stats = new Stats()
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.top = '5px'
		@stats.domElement.style.left = '5px'

		container.appendChild(@renderer.domElement)
		container.appendChild(@stats.domElement)

		@space = new Space(@scene)

	animate: =>
		requestAnimationFrame(@animate)
		@renderer.render(@scene, @camera)
		@stats.update()

new Scene().animate()