class Artifacts
	constructor: (@threeJsScene) ->
		@pullSprite = THREE.ImageUtils.loadTexture("img/pull.png")
		@pushSprite = THREE.ImageUtils.loadTexture("img/push.png")
		@artifacts = []
		@radius = 400
		@effectRange = @radius * 1.5

		for i in [200...200000] by 30
			if Math.random() < 0.01
				@add(i, Math.random() > 0.5)

	add: (zPos, isPuller) ->
		angle = Math.random() * 360
		xPos = Math.sin(angle * Math.PI / 180) * @radius
		yPos = Math.cos(angle * Math.PI / 180) * @radius

		geometry = new THREE.Geometry()
		geometry.vertices.push(new THREE.Vector3(0, 0, 0))
		geometry.verticesNeedUpdate = true

		sprite = if isPuller then @pullSprite else @pushSprite
		material = new THREE.ParticleBasicMaterial(size: 500, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true)
		
		@particles = new THREE.ParticleSystem(geometry, material) 
		@particles.position.set(xPos, yPos, zPos)
		@particles.isPuller = isPuller

		@artifacts.push(@particles)
		@threeJsScene.add(@particles)

	update: (ship) ->
		for artifact in @artifacts

			if artifact.position.z - 300 < ship.camera.position.z < artifact.position.z + 300
				camPos = new THREE.Vector3(ship.camera.position.x, ship.camera.position.y, 0)
				artPos = new THREE.Vector3(artifact.position.x, artifact.position.y, 0)
				distance = artifact.position.distanceTo(ship.camera.position)
				if (distance < @effectRange)
					effectVector = artPos.subSelf(camPos).normalize()
					effectStrength = (1 - (distance / @effectRange)) * 10
					unless artifact.isPuller then effectStrength *= -1
					ship.camera.position.addSelf(effectVector.multiplyScalar(effectStrength))							
