class Hopalong
	constructor: ->
		[@A_MIN, @A_MAX] = [-30, 30]
		[@B_MIN, @B_MAX] = [.2, 1.8]
		[@C_MIN, @C_MAX] = [5, 17]
		[@D_MIN, @D_MAX] = [0, 10]
		[@E_MIN, @E_MAX] = [0, 12]

		@a = @A_MIN + Math.random() * (@A_MAX - @A_MIN)
		@b = @B_MIN + Math.random() * (@B_MAX - @B_MIN)
		@c = @C_MIN + Math.random() * (@C_MAX - @C_MIN)
		@d = @D_MIN + Math.random() * (@D_MAX - @D_MIN)
		@e = @E_MIN + Math.random() * (@E_MAX - @E_MIN)

	createOrbit: (tunelDiameter, particlesPerOrbit, x, y) ->
		[xMin, xMax] = [0, 0]
		[yMin, yMax] = [0, 0]
			
		orbit = for praticle in [0...particlesPerOrbit] by 1
			[x, y] = [y + ((x > 0 ? 1 : -1) * (@d + Math.sqrt(Math.abs(@b * x - @c)))) + @e, @a - x]
			
			if x < xMin then xMin = x
			else if x > xMax then xMax = x

			if y < yMin then yMin = y
			else if y > yMax then yMax = y

			{x: x, y: y}
							
		scaleX = 2 * tunelDiameter / (xMax - xMin)
		scaleY = 2 * tunelDiameter / (yMax - yMin)

		for particle in orbit
			{x: scaleX * (particle.x - xMin) - tunelDiameter, y: scaleY * (particle.y - yMin) - tunelDiameter}

self.onmessage = (event) ->
	randomPos = () ->
		event.data.orbitNumber * .005 * (Math.random() - 0.5)

	self.postMessage({
		orbitNumber: event.data.orbitNumber, 
		orbit: new Hopalong().createOrbit(event.data.tunelDiameter, event.data.particlesPerOrbit, randomPos(), randomPos())
	})
