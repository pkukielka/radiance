class Spedometer
	constructor: (@threeJsScene) ->
		@rectangleSprite = THREE.ImageUtils.loadTexture("img/rect.png")
		windowWidth = window.innerWidth
		windowHeight = window.innerHeight

		currentRectWidth = window.innerWidth / 70
		currentRectHeight = currentRectWidth / 2
		rectanglesCount = 10
		offset = 0.7 * currentRectWidth
		accumulatedHeight = 0
		accumulatedWidth = Math.pow(1.15, 10) * currentRectWidth + rectanglesCount * offset

		@speedometer = for rectNumber in [1..rectanglesCount] by 1
			currentRectWidth *= 1.15
			currentRectHeight *= 1.15 
			accumulatedHeight += currentRectHeight + 10
				
			sprite = new THREE.Sprite( { map: @rectangleSprite, fog: true } )
			sprite.position.set(windowWidth - accumulatedWidth + (offset * rectNumber), windowHeight - accumulatedHeight - 10, -10)
			sprite.color.setHSV(0.2 - 0.02 * rectNumber, 1, 1)
			sprite.opacity = 0.2
			sprite.scale.set(currentRectWidth, currentRectHeight, 1)
			@threeJsScene.add(sprite)
			sprite

	update: (currentSpeed, maxSpeed) ->
		for rect, i in @speedometer
			rect.opacity = if ((i + 1) / @speedometer.length) < Math.abs(currentSpeed / maxSpeed) then 0.7 else 0.2

