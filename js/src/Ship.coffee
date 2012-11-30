class Ship
	constructor: (@threeJsScene, @camera, @space, @endCallback) ->
		@velocity = new THREE.Vector3()

		@lastUpdate = Date.now()

		@moveForward = false
		@moveBackward = false
		@moveLeft = false
		@moveRight = false

		@spedometer = new Spedometer(@threeJsScene)
		@counters = new Counters(@endCallback)

	addEventListeners: ->
		document.addEventListener('mousemove', @onMouseMove, false)
		document.addEventListener('keydown', @onKeyDown, false)
		document.addEventListener('keyup', @onKeyUp, false)

	removeEventListeners: ->
		document.removeEventListener('mousemove', @onMouseMove)
		document.removeEventListener('keydown', @onKeyDown)
		document.removeEventListener('keyup', @onKeyUp)

	onMouseMove: (event) =>
		movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		validateRange = (angle, min, max) ->
			Math.max(min, Math.min(max, angle))

		@camera.rotation.y = validateRange(@camera.rotation.y - (movementX * 0.002), 0.80 *  Math.PI, 1.20 * Math.PI)
		@camera.rotation.x = validateRange(@camera.rotation.x + (movementY * 0.002), 0.25 * -Math.PI, 0.25 * Math.PI)

	onKeyDown: (event) =>
		switch event.keyCode
			when 38, 87 # 'up' or 'w'
				@moveForward = true
			when 40, 83 # 'down' or 's'
				@moveBackward = true
			when 37, 65 # 'left' or 'a'
				@moveLeft = true
			when 39, 68 # 'right' or 'd'
				@moveRight = true

	onKeyUp: (event) =>
		switch event.keyCode
			when 38, 87 # 'up' or 'w'
				@moveForward = false
			when 40, 83 # 'down' or 's'
				@moveBackward = false
			when 37, 65 # 'left' or 'a'
				@moveLeft = false
			when 39, 68 # 'right' or 'd'
				@moveRight = false

	update: ->
		delta = (Date.now() - @lastUpdate) * 0.1
		@lastUpdate = Date.now()

		@velocity.x += (-@velocity.x) * 0.003 * delta
		@velocity.z += (-@velocity.z) * 0.003 * delta

		if @moveForward then @velocity.z -= 0.15 * delta
		if @moveBackward then @velocity.z += 0.15 * delta

		if @moveLeft then @velocity.x -= 0.05 * delta
		if @moveRight then @velocity.x += 0.05 * delta

		if @velocity.z > -5 then @velocity.z = -5

		oldCameraPosition = @camera.position.clone()

		@camera.translateX(@velocity.x + (Math.random() - 0.5) * 0.1 * @velocity.z)
		@camera.translateZ(@velocity.z)
		@camera.translateY((Math.random() - 0.5) * 0.1 * @velocity.z)

		@checkForCollisions(oldCameraPosition, @camera.position.clone())
		@spedometer.update(@velocity.z, 40)
		@counters.update(@velocity.z)

		currentDiameter = Math.sqrt(Math.pow(@camera.position.x, 2) +  Math.pow(@camera.position.y, 2))
		if  currentDiameter > @space.tunelDiameter / 3
			ratio = (@space.tunelDiameter / 3) / currentDiameter
			@camera.position.x *= ratio
			@camera.position.y *= ratio

	checkForCollisions: (oldPosition, newPosition) =>
		for orbit in @space.orbits
			for segment in orbit
				if oldPosition.z <= segment.position.z <= newPosition.z
					newPosition.z = 0
					for verticle in segment.geometry.vertices
						if verticle.distanceTo(newPosition) < 4
							@velocity.x *= 0.9
							@velocity.z *= 0.9
							@camera.translateX((Math.random() - 0.5) * @velocity.z)
							@camera.translateY((Math.random() - 0.5) * @velocity.z)
