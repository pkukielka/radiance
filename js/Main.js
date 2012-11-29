// Generated by CoffeeScript 1.4.0
var Scene, Ship, Space,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Space = (function() {

  function Space(threeJsScene) {
    var orbitNumber, segmentNumber;
    this.threeJsScene = threeJsScene;
    this.initializeOrbitsUpdates = __bind(this.initializeOrbitsUpdates, this);

    this.tunelDiameter = 800;
    this.particlesPerOrbit = 20000;
    this.orbitsCount = 7;
    this.segmentsCount = 5;
    this.suborbitsDistance = 50;
    this.galaxySprite = THREE.ImageUtils.loadTexture("img/galaxy.png");
    this.orbits = (function() {
      var _i, _ref, _results;
      _results = [];
      for (orbitNumber = _i = 0, _ref = this.orbitsCount; _i < _ref; orbitNumber = _i += 1) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (segmentNumber = _j = 0, _ref1 = this.segmentsCount; _j < _ref1; segmentNumber = _j += 1) {
            _results1.push(this.createParticleSystem(this.suborbitsDistance * (orbitNumber + (segmentNumber * this.orbitsCount))));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }).call(this);
    this.initializeOrbitsUpdates();
  }

  Space.prototype.initializeOrbitsUpdates = function() {
    var updateOrbits,
      _this = this;
    this.worker = new Worker("js/Hopalong.js");
    this.worker.onmessage = function(event) {
      var hue, orbitGeometry, segment, vertice, wasInitializedBefore, _i, _len, _ref, _results;
      orbitGeometry = (function() {
        var _i, _len, _ref, _results;
        _ref = event.data.orbit;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vertice = _ref[_i];
          _results.push(new THREE.Vector3(vertice.x, vertice.y, 0));
        }
        return _results;
      })();
      hue = Math.random();
      _ref = _this.orbits[event.data.orbitNumber];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        segment = _ref[_i];
        wasInitializedBefore = segment.geometry.vertices.length > 0;
        segment.material.color.setHSV(hue, 0.7, 1);
        segment.geometry.newVertices = orbitGeometry;
        if (!wasInitializedBefore) {
          segment.geometry.vertices = orbitGeometry;
          _results.push(_this.threeJsScene.add(segment));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    updateOrbits = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = _this.orbitsCount; _i < _ref; i = _i += 1) {
        _results.push(_this.worker.postMessage({
          tunelDiameter: _this.tunelDiameter,
          orbitsCount: _this.orbitsCount,
          orbitNumber: i,
          particlesPerOrbit: _this.particlesPerOrbit
        }));
      }
      return _results;
    };
    updateOrbits();
    return setInterval(updateOrbits, 3000);
  };

  Space.prototype.createParticleSystem = function(zPosition) {
    var geometry, material, paticles;
    geometry = new THREE.Geometry();
    material = new THREE.ParticleBasicMaterial({
      size: 4,
      map: this.galaxySprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    paticles = new THREE.ParticleSystem(geometry, material);
    paticles.position.z = zPosition;
    return paticles;
  };

  Space.prototype.updatePosition = function(zCameraPosition) {
    var i, j, orbit, segment, _i, _len, _ref, _results;
    _ref = this.orbits;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      orbit = _ref[i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _results1 = [];
        for (j = _j = 0, _len1 = orbit.length; _j < _len1; j = ++_j) {
          segment = orbit[j];
          segment.rotation.z += ((_ref1 = (i + j) % 2 > 0) != null ? _ref1 : {
            1: -1
          }) * 0.001 * ((i + j) % 4);
          if (segment.position.z < zCameraPosition) {
            segment.position.z += this.suborbitsDistance * this.orbitsCount * this.segmentsCount;
            segment.geometry.vertices = segment.geometry.newVertices;
            _results1.push(segment.geometry.verticesNeedUpdate = true);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  return Space;

})();

Ship = (function() {

  function Ship(threeJsScene, camera, space) {
    this.threeJsScene = threeJsScene;
    this.camera = camera;
    this.space = space;
    this.checkForCollisions = __bind(this.checkForCollisions, this);

    this.onKeyUp = __bind(this.onKeyUp, this);

    this.onKeyDown = __bind(this.onKeyDown, this);

    this.onMouseMove = __bind(this.onMouseMove, this);

    this.velocity = new THREE.Vector3();
    this.lastUpdate = Date.now();
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.createSpeedometer();
  }

  Ship.prototype.addEventListeners = function() {
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('keydown', this.onKeyDown, false);
    return document.addEventListener('keyup', this.onKeyUp, false);
  };

  Ship.prototype.removeEventListeners = function() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.onKeyDown);
    return document.removeEventListener('keyup', this.onKeyUp);
  };

  Ship.prototype.onMouseMove = function(event) {
    var movementX, movementY, validateRange;
    movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    validateRange = function(angle, min, max) {
      return Math.max(min, Math.min(max, angle));
    };
    this.camera.rotation.y = validateRange(this.camera.rotation.y - (movementX * 0.002), 0.80 * Math.PI, 1.20 * Math.PI);
    return this.camera.rotation.x = validateRange(this.camera.rotation.x + (movementY * 0.002), 0.25 * -Math.PI, 0.25 * Math.PI);
  };

  Ship.prototype.onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38:
      case 87:
        return this.moveForward = true;
      case 40:
      case 83:
        return this.moveBackward = true;
      case 37:
      case 65:
        return this.moveLeft = true;
      case 39:
      case 68:
        return this.moveRight = true;
    }
  };

  Ship.prototype.onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38:
      case 87:
        return this.moveForward = false;
      case 40:
      case 83:
        return this.moveBackward = false;
      case 37:
      case 65:
        return this.moveLeft = false;
      case 39:
      case 68:
        return this.moveRight = false;
    }
  };

  Ship.prototype.update = function() {
    var currentDiameter, delta, oldCameraPosition, ratio;
    delta = (Date.now() - this.lastUpdate) * 0.1;
    this.lastUpdate = Date.now();
    this.velocity.x += (-this.velocity.x) * 0.003 * delta;
    this.velocity.z += (-this.velocity.z) * 0.003 * delta;
    if (this.moveForward) {
      this.velocity.z -= 0.15 * delta;
    }
    if (this.moveBackward) {
      this.velocity.z += 0.15 * delta;
    }
    if (this.moveLeft) {
      this.velocity.x -= 0.05 * delta;
    }
    if (this.moveRight) {
      this.velocity.x += 0.05 * delta;
    }
    if (this.velocity.z > -5) {
      this.velocity.z = -5;
    }
    oldCameraPosition = this.camera.position.clone();
    this.camera.translateX(this.velocity.x + (Math.random() - 0.5) * 0.1 * this.velocity.z);
    this.camera.translateZ(this.velocity.z);
    this.camera.translateY((Math.random() - 0.5) * 0.1 * this.velocity.z);
    this.checkForCollisions(oldCameraPosition, this.camera.position.clone());
    this.adjustSpeedometer(this.velocity.z, 40);
    currentDiameter = Math.sqrt(Math.pow(this.camera.position.x, 2) + Math.pow(this.camera.position.y, 2));
    if (currentDiameter > this.space.tunelDiameter / 3) {
      ratio = (this.space.tunelDiameter / 3) / currentDiameter;
      this.camera.position.x *= ratio;
      return this.camera.position.y *= ratio;
    }
  };

  Ship.prototype.checkForCollisions = function(oldPosition, newPosition) {
    var orbit, segment, verticle, _i, _len, _ref, _results;
    _ref = this.space.orbits;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orbit = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = orbit.length; _j < _len1; _j++) {
          segment = orbit[_j];
          if ((oldPosition.z <= (_ref1 = segment.position.z) && _ref1 <= newPosition.z)) {
            newPosition.z = 0;
            _results1.push((function() {
              var _k, _len2, _ref2, _results2;
              _ref2 = segment.geometry.vertices;
              _results2 = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                verticle = _ref2[_k];
                if (verticle.distanceTo(newPosition) < 4) {
                  this.velocity.x *= 0.9;
                  this.velocity.z *= 0.9;
                  this.camera.translateX((Math.random() - 0.5) * this.velocity.z);
                  _results2.push(this.camera.translateY((Math.random() - 0.5) * this.velocity.z));
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            }).call(this));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Ship.prototype.adjustSpeedometer = function(currentSpeed, maxSpeed) {
    var i, rect, _i, _len, _ref, _results;
    _ref = this.speedometer;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      rect = _ref[i];
      _results.push(rect.opacity = ((i + 1) / this.speedometer.length) < Math.abs(currentSpeed / maxSpeed) ? 0.4 : 0.2);
    }
    return _results;
  };

  Ship.prototype.createSpeedometer = function() {
    var accumulatedHeight, accumulatedWidth, currentRectHeight, currentRectWidth, offset, rectNumber, rectanglesCount, sprite, windowHeight, windowWidth;
    this.rectangleSprite = THREE.ImageUtils.loadTexture("img/rect.png");
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    currentRectWidth = window.innerWidth / 70;
    currentRectHeight = currentRectWidth / 2;
    rectanglesCount = 10;
    offset = 0.7 * currentRectWidth;
    accumulatedHeight = 0;
    accumulatedWidth = Math.pow(1.15, 10) * currentRectWidth + rectanglesCount * offset;
    return this.speedometer = (function() {
      var _i, _results;
      _results = [];
      for (rectNumber = _i = 1; _i <= rectanglesCount; rectNumber = _i += 1) {
        currentRectWidth *= 1.15;
        currentRectHeight *= 1.15;
        accumulatedHeight += currentRectHeight + 10;
        sprite = new THREE.Sprite({
          map: this.rectangleSprite,
          fog: true
        });
        sprite.position.set(windowWidth - accumulatedWidth + (offset * rectNumber), windowHeight - accumulatedHeight - 10, -10);
        sprite.color.setHSV(0.2 - 0.02 * rectNumber, 1, 1);
        sprite.opacity = 0.2;
        sprite.scale.set(currentRectWidth, currentRectHeight, 1);
        this.threeJsScene.add(sprite);
        _results.push(sprite);
      }
      return _results;
    }).call(this);
  };

  return Ship;

})();

Scene = (function() {

  function Scene() {
    this.animate = __bind(this.animate, this);
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }
    this.enabled = false;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0011);
    this.renderer = new THREE.WebGLRenderer({
      clearColor: 0x000000,
      clearAlpha: 1,
      antialias: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '5px';
    this.stats.domElement.style.left = '5px';
    document.body.appendChild(this.renderer.domElement);
    document.body.appendChild(this.stats.domElement);
    this.space = new Space(this.scene);
    this.ship = new Ship(this.scene, this.camera, this.space);
    this.camera.rotation.y = Math.PI;
  }

  Scene.prototype.enable = function() {
    this.enabled = true;
    return this.ship.addEventListeners();
  };

  Scene.prototype.disable = function() {
    this.enabled = false;
    return this.ship.removeEventListeners();
  };

  Scene.prototype.animate = function() {
    if (this.enabled) {
      this.ship.update();
      this.space.updatePosition(this.camera.position.z);
    }
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    return this.stats.update();
  };

  return Scene;

})();
