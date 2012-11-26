// Generated by CoffeeScript 1.4.0
(function() {
  var Hopalong, Scene, Space,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Hopalong = (function() {

    function Hopalong() {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = [-30, 30], this.A_MIN = _ref[0], this.A_MAX = _ref[1];
      _ref1 = [.2, 1.8], this.B_MIN = _ref1[0], this.B_MAX = _ref1[1];
      _ref2 = [5, 17], this.C_MIN = _ref2[0], this.C_MAX = _ref2[1];
      _ref3 = [0, 10], this.D_MIN = _ref3[0], this.D_MAX = _ref3[1];
      _ref4 = [0, 12], this.E_MIN = _ref4[0], this.E_MAX = _ref4[1];
      this.a = this.A_MIN + Math.random() * (this.A_MAX - this.A_MIN);
      this.b = this.B_MIN + Math.random() * (this.B_MAX - this.B_MIN);
      this.c = this.C_MIN + Math.random() * (this.C_MAX - this.C_MIN);
      this.d = this.D_MIN + Math.random() * (this.D_MAX - this.D_MIN);
      this.e = this.E_MIN + Math.random() * (this.E_MAX - this.E_MIN);
    }

    Hopalong.prototype.createOrbit = function(maxSize, particlesNum, x, y) {
      var orbit, particle, praticle, scaleX, scaleY, xMax, xMin, yMax, yMin, _i, _len, _ref, _ref1, _results;
      _ref = [0, 0], xMin = _ref[0], xMax = _ref[1];
      _ref1 = [0, 0], yMin = _ref1[0], yMax = _ref1[1];
      orbit = (function() {
        var _i, _ref2, _ref3, _results;
        _results = [];
        for (praticle = _i = 0; _i < particlesNum; praticle = _i += 1) {
          _ref3 = [
            y + (((_ref2 = x > 0) != null ? _ref2 : {
              1: -1
            }) * (this.d + Math.sqrt(Math.abs(this.b * x - this.c)))) + this.e, this.a - x
          ], x = _ref3[0], y = _ref3[1];
          if (x < xMin) {
            xMin = x;
          } else if (x > xMax) {
            xMax = x;
          }
          if (y < yMin) {
            yMin = y;
          } else if (y > yMax) {
            yMax = y;
          }
          _results.push(new THREE.Vector3(x, y, 0));
        }
        return _results;
      }).call(this);
      scaleX = 2 * maxSize / (xMax - xMin);
      scaleY = 2 * maxSize / (yMax - yMin);
      _results = [];
      for (_i = 0, _len = orbit.length; _i < _len; _i++) {
        particle = orbit[_i];
        _results.push(new THREE.Vector3(scaleX * (particle.x - xMin) - maxSize, scaleY * (particle.y - yMin) - maxSize, 0));
      }
      return _results;
    };

    return Hopalong;

  })();

  Space = (function() {

    function Space(threeJsScene) {
      var hopalong, maxSize, orbit, particlesPerOrbit, segment, segmentsCount, suborbit, suborbitsCount, _i, _j;
      this.threeJsScene = threeJsScene;
      maxSize = 1000;
      particlesPerOrbit = 40000;
      suborbitsCount = 5;
      segmentsCount = 5;
      this.suborbitsDistance = 50;
      this.galaxySprite = THREE.ImageUtils.loadTexture("img/galaxy.png");
      hopalong = new Hopalong();
      for (suborbit = _i = 0; _i < suborbitsCount; suborbit = _i += 1) {
        orbit = hopalong.createOrbit(maxSize, particlesPerOrbit, suborbit * .005 * (Math.random() - 0.5), suborbit * .005 * (Math.random() - 0.5));
        for (segment = _j = 0; _j < segmentsCount; segment = _j += 1) {
          this.addSingleOrbit(orbit, suborbit + segment * 5);
        }
      }
    }

    Space.prototype.addSingleOrbit = function(orbitGeometry, orbitNumber) {
      var geometry, material, particles;
      geometry = new THREE.Geometry();
      geometry.vertices = orbitGeometry;
      material = new THREE.ParticleBasicMaterial({
        size: 5,
        map: this.galaxySprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });
      material.color.setHSV(Math.random(), 0.7, 1);
      particles = new THREE.ParticleSystem(geometry, material);
      particles.position.z = this.suborbitsDistance * orbitNumber;
      particles.needsUpdate = 0;
      return this.threeJsScene.add(particles);
    };

    return Space;

  })();

  Scene = (function() {

    function Scene() {
      this.animate = __bind(this.animate, this);

      var container;
      container = document.createElement('div');
      document.body.appendChild(container);
      if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
      }
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.lookAt(new THREE.Vector3(0, 0, 10));
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x000000, 0.0011);
      this.renderer = new THREE.WebGLRenderer({
        clearColor: 0x000000,
        clearAlpha: 1,
        antialias: false
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '5px';
      this.stats.domElement.style.left = '5px';
      container.appendChild(this.renderer.domElement);
      container.appendChild(this.stats.domElement);
      this.space = new Space(this.scene);
    }

    Scene.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      return this.stats.update();
    };

    return Scene;

  })();

  new Scene().animate();

}).call(this);
