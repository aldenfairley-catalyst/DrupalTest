/**
 * @file cursor.js
 * Implements a custom cursor that follows the mouse pointer and
 * highlights interactive elements. The cursor is disabled on touch
 * devices to avoid interfering with native touch interactions.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandCursor = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }
      // Skip custom cursor on touch devices.
      if ('ontouchstart' in window) {
        return;
      }
      // Create the cursor element.
      var cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);

      // Move the cursor element with the mouse.
      function move(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
      document.addEventListener('mousemove', move);

      // Enlarge cursor when hovering interactive elements.
      function activate() {
        cursor.classList.add('active');
      }
      function deactivate() {
        cursor.classList.remove('active');
      }
      var interactiveSelectors = ['a', 'button', '.reveal'];
      interactiveSelectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (elem) {
          elem.addEventListener('mouseenter', activate);
          elem.addEventListener('mouseleave', deactivate);
        });
      });
    }
  };
})(Drupal, drupalSettings);
