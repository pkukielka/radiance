class Scene
	constructor: ->
		if !Detector.webgl then Detector.addGetWebGLMessage()

		@enabled = false

		@scene = new THREE.Scene()
		@scene.fog = new THREE.FogExp2(0x000000, 0.0005)

		@renderer = new THREE.WebGLRenderer(clearColor: 0x000000, clearAlpha: 1, antialias: false)
		@renderer.setSize(window.innerWidth, window.innerHeight)

		@camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)

		@stats = new Stats()
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.top = '5px'
		@stats.domElement.style.left = '5px'

		document.body.appendChild(@renderer.domElement)
		document.body.appendChild(@stats.domElement)

		@space = new Space(@scene)
		@ship = new Ship(@scene, @camera, @space, @displayRecord)
		@artifacts = new Artifacts(@scene)
		
		@camera.rotation.y = Math.PI

	enable: ->
		@enabled = true
		@ship.addEventListeners()

	disable: ->
		@enabled = false
		@ship.removeEventListeners()

	animate: =>
		if @enabled
			@ship.update()
			@artifacts.update(@ship)
			@space.updatePosition(@camera.position.z)

		requestAnimationFrame(@animate)
		@renderer.render(@scene, @camera)
		@stats.update()

	displayRecord: (record) =>
		@disable()
		blocker = document.getElementById('blocker')
		instructions = document.getElementById('instructions')
		blocker.style.display = '-webkit-box'
		blocker.style.display = '-moz-box'
		blocker.style.display = 'box'
		instructions.style.display = ''
		instructions.innerHTML = '<span style="font-size:30px">Congratulations, your score is ' + record + '!<br><br>' +
			'To play again please press F5 button.</span>'