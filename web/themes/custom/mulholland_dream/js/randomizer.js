/**
 * @file randomizer.js
 * Provides randomised atmospheric elements: background images, quotes and
 * occasional silhouette easter eggs. Images and quotes can be overridden
 * via drupalSettings.mulhollandDream.randomElements; otherwise default
 * values are used. A random background image is selected and applied via
 * a CSS variable. A quote overlay fades in and out periodically. With a
 * small probability, a silhouette image appears and disappears. The
 * behaviour runs once on page load.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandRandomizer = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }
      // Prevent multiple initialisations.
      if (document.body.dataset.randomizerLoaded) {
        return;
      }
      document.body.dataset.randomizerLoaded = true;

      // Determine the base theme path from drupalSettings (preferred) or fall back to Drupal.theme.path.
      function resolveThemePath() {
        var themePathSetting = settings.mulhollandDream && settings.mulhollandDream.themePath;
        var themePath = '';
        if (themePathSetting) {
          themePath = themePathSetting;
        }
        else if (Drupal.theme && Drupal.theme.path) {
          themePath = Drupal.theme.path;
        }
        if (themePath && themePath.charAt(0) !== '/') {
          themePath = '/' + themePath;
        }
        if (themePath && themePath.charAt(themePath.length - 1) !== '/') {
          themePath += '/';
        }
        return themePath;
      }

      var basePath = resolveThemePath();
      var defaults = {
        images: [
          basePath + 'images/bg.theatre.png',
          basePath + 'images/bg.forest.png',
          basePath + 'images/bg.curtain.png'
        ],
        quotes: [
          // Updated dreamlike phrases to enhance the surreal atmosphere.
          'No hay banda. There is no band.',
          'Silencio.',
          'It\u2019s only a dream within a dream.',
          'Wake up. Wake up.',
          'The night is darkest before the dawn.',
          'Illusion is the first of all pleasures.',
          'There\u2019s always music in the air.',
          'This is the girl.'
        ]
      };

      // Read configuration from drupalSettings if present.
      var cfg = (settings.mulhollandDream && settings.mulhollandDream.randomElements) || {};
      var images = Array.isArray(cfg.images) && cfg.images.length ? cfg.images : defaults.images;
      var quotes = Array.isArray(cfg.quotes) && cfg.quotes.length ? cfg.quotes : defaults.quotes;
      images = images.map(function (path) {
        return (path || '').toString();
      }).filter(function (path) { return path.length; });
      quotes = quotes.map(function (quote) {
        return (quote || '').toString();
      }).filter(function (quote) { return quote.length; });
      if (!images.length) {
        images = defaults.images;
      }
      if (!quotes.length) {
        quotes = defaults.quotes;
      }

      // Select and apply a random background image. The CSS variable --hero-bg can be
      // used in CSS (e.g., as a background-image: var(--hero-bg)).
      var chosenImage = images[Math.floor(Math.random() * images.length)];
      document.documentElement.style.setProperty('--hero-bg', 'url(' + chosenImage + ')');

      // Insert a random quote overlay. It fades in and out via CSS animation.
      var quoteText = quotes[Math.floor(Math.random() * quotes.length)];
      var quoteDiv = document.createElement('div');
      quoteDiv.className = 'quote-overlay';
      quoteDiv.textContent = quoteText;
      document.body.appendChild(quoteDiv);

      // Occasionally display a silhouette element as an easter egg (10% chance).
      if (Math.random() < 0.1) {
        var sil = document.createElement('img');
        sil.className = 'silhouette';
        sil.src = basePath + 'images/silhouette.png';
        document.body.appendChild(sil);
        // Remove the silhouette after its animation completes.
        sil.addEventListener('animationend', function () {
          if (sil.parentNode) {
            sil.parentNode.removeChild(sil);
          }
        });
      }
    }
  };
})(Drupal, drupalSettings);
