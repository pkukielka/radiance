class Space
	constructor: (@threeJsScene) ->
		@tunelDiameter = 1000
		@particlesPerOrbit = 20000
		@orbitsCount = 7
		@segmentsCount = 5
		@suborbitsDistance = 50
		@galaxySprite = THREE.ImageUtils.loadTexture("img/galaxy.png")

		@orbits = for orbitNumber in [0...@orbitsCount] by 1	
			for segmentNumber in [0...@segmentsCount] by 1
				@createParticleSystem(@suborbitsDistance * (orbitNumber + (segmentNumber * @orbitsCount)))
		
		@initializeOrbitsUpdates()

	initializeOrbitsUpdates: =>
		@worker = new Worker("js/Hopalong.js")
		@worker.onmessage = (event) =>
			orbitGeometry = (new THREE.Vector3(vertice.x, vertice.y, 0) for vertice in event.data.orbit)

			hue = Math.random()
			for segment in @orbits[event.data.orbitNumber]
				wasInitializedBefore = segment.geometry.vertices.length > 0
				segment.material.color.setHSV(hue, 0.7, 1)
				segment.geometry.newVertices = orbitGeometry
				unless wasInitializedBefore
					segment.geometry.vertices = orbitGeometry
					@threeJsScene.add(segment)

		updateOrbits = () =>
			for i in [0...@orbitsCount] by 1
				@worker.postMessage({tunelDiameter: @tunelDiameter, orbitsCount: @orbitsCount, orbitNumber: i, particlesPerOrbit: @particlesPerOrbit})
		
		updateOrbits()
		setInterval(updateOrbits, 3000)

	createParticleSystem: (zPosition) ->
		geometry = new THREE.Geometry()
		material = new THREE.ParticleBasicMaterial(size: 4, map: @galaxySprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true)
		praticles = new THREE.ParticleSystem(geometry, material) 
		praticles.position.z = zPosition
		praticles

	updatePosition: (zCameraPosition) ->
		for orbit, i in @orbits
			for segment, j in orbit
				segment.rotation.z += ((i + j) % 2 > 0 ? 1 : -1) * 0.001 * ((i + j) % 4)
				if segment.position.z < zCameraPosition
					segment.position.z += @suborbitsDistance * @orbitsCount * @segmentsCount
					segment.geometry.vertices = segment.geometry.newVertices
					segment.geometry.verticesNeedUpdate = true
