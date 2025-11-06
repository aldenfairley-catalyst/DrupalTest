/**
 * @file color-transition.js
 * Performs smooth background colour transitions based on scroll position.
 *
 * This behaviour interpolates between defined colours as the user scrolls
 * through the page. It respects the prefers-reduced-motion media query
 * by disabling animations when necessary. Colours can be customised
 * in color-transition.css via CSS variables or replaced entirely via
 * JavaScript by modifying the `colours` array below.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandColorTransition = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }
      // Respect user preference for reduced motion.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Helper to linearly interpolate between two colours.
      function lerpColor(a, b, amount) {
        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
        return '#' + (1 << 24 | (rr << 16) | (rg << 8) | rb).toString(16).slice(1);
      }

      // Define the colours to transition through. Additional colours can be added.
      var colours = ['#181818', '#0a1026', '#301242'];
      var body = document.body;

      function onScroll() {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollY = window.scrollY;
        var ratio = docHeight > 0 ? scrollY / docHeight : 0;
        // Determine which segment of the colours array we're in.
        var segCount = colours.length - 1;
        var segment = Math.min(Math.floor(ratio * segCount), segCount - 1);
        var localRatio = (ratio * segCount) - segment;
        var newColor = lerpColor(colours[segment], colours[segment + 1] || colours[segment], localRatio);
        body.style.backgroundColor = newColor;
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      // Initial call to set the colour on page load.
      onScroll();
    }
  };
})(Drupal, drupalSettings);