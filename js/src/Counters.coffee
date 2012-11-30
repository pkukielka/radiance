class Counters
	constructor: (@endCallback) ->
		@totalDistance = 0
		@timeLeft = 2 * 60 * 1000
		@lastUpdate = Date.now()

		windowWidth = window.innerWidth
		windowHeight = window.innerHeight

		counterWidth = window.innerWidth / 18
		counterHeight = counterWidth / 2

		@time = @creatediv('time', 'counter', counterWidth, counterHeight, windowWidth / 2 - counterWidth - 10, 20, 'Time:', @getTimeString())
		@dist = @creatediv('time', 'counter', counterWidth, counterHeight, windowWidth / 2 + 10, 20, 'Distance:', @getDistanceString())

	creatediv: (id, className, width, height, left, top, name, startValue) ->
		div = document.createElement('div')
		div.setAttribute('class', 'counter')
		div.style.position = 'absolute'
		div.style.width = width + 'px'
		div.style.height = height + 'px'
		div.style.backgroundImage = 'url(img/rectEmpty.png)'
		div.style.opacity = '0.7'
		div.style.left = left + 'px'
		div.style.top = top + 'px'

		spanName = document.createElement('span')
		spanName.innerHTML = name

		spanValue = document.createElement('span')
		spanValue.style.fontSize = height / 3 + 'px'
		spanValue.innerHTML = startValue

		div.appendChild(spanName)
		div.appendChild(document.createElement('br');)
		div.appendChild(spanValue)
		document.body.appendChild(div)
		
		spanValue

	getTimeString: ->
		min = Math.floor(@timeLeft / (60 * 1000))
		sec = Math.floor((@timeLeft % (60 * 1000)) / 1000)
		mili = Math.floor((@timeLeft % 1000) / 10)

		if sec < 10 then sec = '0' + sec
		if mili < 10 then mili = '0' + mili

		min + ':' + sec + ':' + mili

	getDistanceString: ->
		Math.abs(Math.floor(@totalDistance))

	update: (gainedDistance) ->
		@totalDistance += gainedDistance
		@dist.innerHTML = @getDistanceString()

		@timeLeft -= (Date.now() - @lastUpdate)
		@lastUpdate = Date.now()

		if @timeLeft < 10 * 1000
			@time.style.backgroundColor = 'red'

		if @timeLeft < 0
			@timeLeft = 0
			@endCallback(@getDistanceString())

		@time.innerHTML = @getTimeString()

