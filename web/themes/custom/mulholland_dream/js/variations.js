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
      // The behaviour only makes sense for the top-level document. Drupal can
      // re-attach behaviours to smaller DOM fragments (e.g. on Ajax responses),
      // so bail out early in those cases to avoid duplicating work.
      if (context !== document) {
        return;
      }

      // Ensure this runs only once per page load.
      if (document.body.dataset.variationLoaded) {
        return;
      }
      document.body.dataset.variationLoaded = true;

      var configuredVariations = settings.mulhollandDream && settings.mulhollandDream.variations;
      var variations = Array.isArray(configuredVariations) && configuredVariations.length
        ? configuredVariations.map(function (item) { return (item || '').toString().trim(); })
            .filter(function (item) { return item.length; })
        : [];
      if (!variations.length) {
        variations = ['gothic', 'nightmare', 'dreamscape', 'labyrinth'];
      }
      var chosen = null;

      // Attempt to read the style query parameter from the URL. This allows
      // authors to provide preview links such as `?style=dreamscape`.
      try {
        var params = new URLSearchParams(window.location.search);
        var styleParam = params.get('style');
        if (styleParam && variations.indexOf(styleParam) !== -1) {
          chosen = styleParam;
        }
      } catch (e) {
        // Gracefully ignore errors in environments where URLSearchParams is unsupported.
      }

      // Next, fall back to a theme-provided default if one was provided via
      // drupalSettings. This allows editors (or theme configuration) to keep a
      // consistent primary look & feel while still enabling the query-string
      // override above for previews.
      if (!chosen) {
        var configured = settings.mulhollandDream && settings.mulhollandDream.defaultVariation;
        if (configured && variations.indexOf(configured) !== -1) {
          chosen = configured;
        }
      }

      // Pick a random variation if none was specified or configured. Randomising
      // on each page load keeps the dream-like aesthetic when no default was set.
      if (!chosen) {
        var index = Math.floor(Math.random() * variations.length);
        chosen = variations[index];
      }

      // Apply the theme class to the body element so that variations.css can
      // scope its rules using `.theme-<variation>` selectors.
      document.body.classList.add('theme-' + chosen);
    }
  };
})(Drupal, drupalSettings);
