// Generated by CoffeeScript 1.4.0
var Hopalong;

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

  Hopalong.prototype.createOrbit = function(tunelDiameter, particlesPerOrbit, x, y) {
    var orbit, particle, praticle, scaleX, scaleY, xMax, xMin, yMax, yMin, _i, _len, _ref, _ref1, _results;
    _ref = [0, 0], xMin = _ref[0], xMax = _ref[1];
    _ref1 = [0, 0], yMin = _ref1[0], yMax = _ref1[1];
    orbit = (function() {
      var _i, _ref2, _ref3, _results;
      _results = [];
      for (praticle = _i = 0; _i < particlesPerOrbit; praticle = _i += 1) {
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
        _results.push({
          x: x,
          y: y
        });
      }
      return _results;
    }).call(this);
    scaleX = 2 * tunelDiameter / (xMax - xMin);
    scaleY = 2 * tunelDiameter / (yMax - yMin);
    _results = [];
    for (_i = 0, _len = orbit.length; _i < _len; _i++) {
      particle = orbit[_i];
      _results.push({
        x: scaleX * (particle.x - xMin) - tunelDiameter,
        y: scaleY * (particle.y - yMin) - tunelDiameter
      });
    }
    return _results;
  };

  return Hopalong;

})();

self.onmessage = function(event) {
  var randomPos;
  randomPos = function() {
    return event.data.orbitNumber * .005 * (Math.random() - 0.5);
  };
  return self.postMessage({
    orbitNumber: event.data.orbitNumber,
    orbit: new Hopalong().createOrbit(event.data.tunelDiameter, event.data.particlesPerOrbit, randomPos(), randomPos())
  });
};
