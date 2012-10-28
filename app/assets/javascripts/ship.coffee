window.onload = () ->
  stage = new Kinetic.Stage
    container: "main-container"
    width: window.innerWidth
    height: window.innerHeight

  layer = new Kinetic.Layer

  ship = new Kinetic.RegularPolygon
    x: stage.getWidth() / 2
    y: 200
    sides: 6
    radius: 20
    fill: "red"
    stroke: "black"
    strokeWidth: 4

  layer.add(ship)

  stage.add(layer)

  moveShip = (evt) ->
    ship.move(evt.clientX - ship.getX(), evt.clientY - ship.getY())
    stage.draw()

  document.getElementById("main-container").addEventListener("mousemove", moveShip, false)

