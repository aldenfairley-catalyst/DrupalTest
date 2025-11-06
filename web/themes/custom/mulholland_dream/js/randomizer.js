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
      var themePathSetting = settings.mulhollandDream && settings.mulhollandDream.themePath;
      var basePath = '';
      if (themePathSetting) {
        basePath = themePathSetting;
      }
      else if (Drupal.theme && Drupal.theme.path) {
        basePath = Drupal.theme.path;
      }
      if (basePath && basePath.charAt(0) !== '/') {
        basePath = '/' + basePath;
      }
      if (basePath && basePath.charAt(basePath.length - 1) !== '/') {
        basePath += '/';
      }
      var defaults = {
        images: [
          basePath + 'images/bg.theatre.png',
          basePath + 'images/bg.forest.png',
          basePath + 'images/bg.curtain.png'
        ],
        quotes: [
          'No hay banda. There is no band.',
          'Silencio.',
          'It is just an illusion.',
          'I\u2019m in love. I\u2019m in love with you.',
          'This is the girl.'
        ]
      };

      // Read configuration from drupalSettings if present.
      var cfg = (settings.mulhollandDream && settings.mulhollandDream.randomElements) || {};
      var images = cfg.images || defaults.images;
      var quotes = cfg.quotes || defaults.quotes;

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
