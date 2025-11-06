/**
 * @file floating-text.js
 * Adds random floating text elements that drift across the viewport.
 *
 * Each floating element selects a random phrase, direction and size,
 * then animates across the screen. The elements automatically remove
 * themselves after the animation completes. This behaviour is
 * initialised once per page load and respects Drupal behaviours.
 */
(function (Drupal) {
  'use strict';
  Drupal.behaviors.mulhollandFloatingText = {
    attach: function (context) {
      if (context !== document) {
        return;
      }
      // Prevent multiple initialisations on the same page.
      if (document.body.dataset.floatingTextLoaded) {
        return;
      }
      document.body.dataset.floatingTextLoaded = 'true';

      // Messages to display. Entities like &nbsp; allow phrases with breaks.
      var messages = [
        'Dream',
        'Silencio',
        'Illusion',
        'Mystery',
        'Wake&nbsp;Up',
        'Beyond',
        'Nightmare',
        'Whisper'
      ];

      /**
       * Spawn a new floating element with random attributes.
       */
      function createFloating() {
        var msg = messages[Math.floor(Math.random() * messages.length)];
        var span = document.createElement('span');
        span.className = 'floating-text';
        span.innerHTML = msg;
        // Randomly select direction: 0 = L→R, 1 = R→L, 2 = T→B, 3 = B→T.
        var direction = Math.floor(Math.random() * 4);
        var classes = ['float-left', 'float-right', 'float-down', 'float-up'];
        span.classList.add(classes[direction]);
        // Random font size and opacity for variety.
        var size = 0.8 + Math.random() * 1.2;
        span.style.fontSize = (size * 1.5) + 'rem';
        span.style.opacity = (0.7 + Math.random() * 0.3).toString();
        // Position the element along the perpendicular axis.
        if (direction === 0 || direction === 1) {
          span.style.top = Math.floor(Math.random() * 90) + '%';
        }
        else {
          span.style.left = Math.floor(Math.random() * 90) + '%';
        }
        // Random animation duration between 6 and 12 seconds.
        span.style.animationDuration = (6 + Math.random() * 6) + 's';
        document.body.appendChild(span);
        span.addEventListener('animationend', function () {
          if (span.parentNode) {
            span.parentNode.removeChild(span);
          }
        });
      }
      // Pre-seed a few floating texts at staggered intervals.
      for (var i = 0; i < 4; i++) {
        setTimeout(createFloating, i * 1500);
      }
      // Continue spawning new floating texts periodically.
      setInterval(createFloating, 4000);
    }
  };
})(Drupal);