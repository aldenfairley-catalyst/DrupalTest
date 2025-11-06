/**
 * @file variations.js
 * Adds a random or user-selected theme variation class to the body element.
 *
 * The script reads a `style` query parameter (e.g., `?style=dreamscape`) to
 * determine which variation to apply. If none is provided, it selects one
 * randomly from the available variations. The selected variation is applied
 * as a `theme-<variation>` class on the <body> element, which is used by
 * variations.css to style the page. The behaviour runs only once per page
 * load to avoid adding multiple classes.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandVariations = {
    attach: function (context, settings) {
      // Ensure this runs only once per page load.
      if (document.body.dataset.variationLoaded) {
        return;
      }
      document.body.dataset.variationLoaded = true;

      var variations = ['gothic', 'nightmare', 'dreamscape', 'labyrinth'];
      var chosen = null;

      // Attempt to read the style query parameter from the URL.
      try {
        var params = new URLSearchParams(window.location.search);
        var styleParam = params.get('style');
        if (styleParam && variations.indexOf(styleParam) !== -1) {
          chosen = styleParam;
        }
      } catch (e) {
        // Gracefully ignore errors in environments where URLSearchParams is unsupported.
      }

      // Pick a random variation if none was specified.
      if (!chosen) {
        var index = Math.floor(Math.random() * variations.length);
        chosen = variations[index];
      }

      // Apply the theme class to the body element.
      document.body.classList.add('theme-' + chosen);
    }
  };
})(Drupal, drupalSettings);