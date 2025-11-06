/**
 * @file smoke-effect.js
 *
 * Renders a gentle smoke or mist animation behind page content.  When
 * attached to the document, this behaviour either finds an existing
 * canvas with the ID `smoke-canvas` or creates one automatically.  It
 * then spawns semi‑transparent particles along the bottom of the
 * viewport which drift upward and fade out.  The result is a subtle
 * atmospheric effect that enhances the dreamlike aesthetic without
 * interfering with interactivity.  All pointer events are disabled on
 * the canvas so that it does not capture clicks or drags.
 */

(function (Drupal) {
  'use strict';
  Drupal.behaviors.mulhollandSmokeEffect = {
    attach: function (context) {
      // Only initialise once on the full document.  If a smoke canvas
      // already has an animation loop running, do nothing.
      if (context !== document) {
        return;
      }
      if (document.body.dataset.smokeEffectLoaded) {
        return;
      }
      document.body.dataset.smokeEffectLoaded = 'true';

      // Locate or create the canvas element.  Use a fixed positioning
      // class so CSS can position it under other content.  Disable
      // pointer events via CSS (see style.css) so it does not block
      // clicks or drags.
      var canvas = document.getElementById('smoke-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'smoke-canvas';
        canvas.className = 'smoke-canvas';
        document.body.appendChild(canvas);
      }
      var ctx = canvas.getContext('2d');

      // Ensure the canvas fills the viewport and update on resize.
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      // Particle constructor.  Each particle spawns below the visible
      // area with a random radius, opacity and speed.  When it fades
      // completely or moves off screen, it is reset.
      function Particle() {
        this.reset();
      }
      Particle.prototype.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.radius = 20 + Math.random() * 40;
        this.opacity = 0.2 + Math.random() * 0.3;
        this.speedY = 0.3 + Math.random() * 0.7;
        this.decay = 0.0005 + Math.random() * 0.001;
      };
      Particle.prototype.update = function () {
        this.y -= this.speedY;
        this.opacity -= this.decay;
        if (this.opacity <= 0 || this.y + this.radius < 0) {
          this.reset();
        }
      };
      Particle.prototype.draw = function (ctx) {
        var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + this.opacity + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      };

      // Create a modest number of particles to achieve the effect
      // without significantly impacting performance.  The number can
      // be adjusted if needed; 30 provides full coverage on most
      // screens.
      var particles = [];
      var NUM_PARTICLES = 30;
      for (var i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
      }

      // Animation loop.  Clear the canvas, update each particle and
      // redraw.  requestAnimationFrame ensures a smooth frame rate.
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < NUM_PARTICLES; i++) {
          var p = particles[i];
          p.update();
          p.draw(ctx);
        }
        window.requestAnimationFrame(animate);
      }
      animate();
    }
  };
})(Drupal);