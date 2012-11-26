class Space
	constructor: (@threeJsScene) ->
		maxSize = 1000
		particlesPerOrbit = 40000
		suborbitsCount = 5
		segmentsCount = 5

		@suborbitsDistance = 50
		@galaxySprite = THREE.ImageUtils.loadTexture("img/galaxy.png")
		hopalong = new Hopalong()

		for suborbit in [0...suborbitsCount] by 1	
			orbit = hopalong.createOrbit(maxSize, particlesPerOrbit, suborbit * .005 * (Math.random() - 0.5), suborbit * .005 * (Math.random() - 0.5))
			for segment in [0...segmentsCount] by 1
				@addSingleOrbit(orbit, suborbit + segment * 5)


	addSingleOrbit: (orbitGeometry, orbitNumber) ->
		geometry = new THREE.Geometry();
		geometry.vertices = orbitGeometry

		material = new THREE.ParticleBasicMaterial(size: 5, map: @galaxySprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true)
		material.color.setHSV(Math.random(), 0.7, 1)

		particles = new THREE.ParticleSystem(geometry, material)
		particles.position.z = @suborbitsDistance * orbitNumber
		particles.needsUpdate = 0

		@threeJsScene.add(particles)	