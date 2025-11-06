/**
 * @file audio.js
 * Manages ambient audio and sound effects triggered by user interactions.
 *
 * Sounds are loaded lazily when the user first interacts with the page to
 * comply with browser autoplay policies. A simple UI allows the user to mute
 * the ambient track and adjust volume. Additional sounds are played on
 * menu hover, page transitions and when silhouettes appear. Configuration
 * can be extended via drupalSettings.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandAudio = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }
      // Avoid multiple initialisations.
      if (document.body.dataset.audioLoaded) {
        return;
      }
      document.body.dataset.audioLoaded = true;

      var ambient, hoverSound, transitionSound, whisperSound;

      // Lazy-load audio on first user interaction.
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

      function loadSounds() {
        if (!ambient) {
          var themePath = resolveThemePath();
          ambient = new Audio(themePath + 'audio/ambient_hum.wav');
          ambient.loop = true;
          hoverSound = new Audio(themePath + 'audio/menu_hover.wav');
          transitionSound = new Audio(themePath + 'audio/transition.wav');
          whisperSound = new Audio(themePath + 'audio/whisper.wav');
          ambient.volume = 0.5;
        }
        ambient.play().catch(function(){});
        document.removeEventListener('click', loadSounds);
      }
      // Listen for first click to initialise audio.
      document.addEventListener('click', loadSounds);

      // Create a simple audio controller UI.
      var controller = document.createElement('div');
      controller.className = 'audio-controller';
      controller.style.position = 'fixed';
      controller.style.bottom = '1rem';
      controller.style.left = '1rem';
      controller.style.background = 'rgba(0,0,0,0.6)';
      controller.style.color = '#fff';
      controller.style.padding = '0.5rem';
      controller.style.borderRadius = '4px';
      controller.style.fontSize = '0.9rem';
      controller.style.zIndex = '10000';
      controller.setAttribute('role', 'region');
      controller.setAttribute('aria-label', 'Audio controls');

      var muteBtn = document.createElement('button');
      muteBtn.textContent = 'Mute';
      muteBtn.style.marginRight = '0.5rem';
      muteBtn.addEventListener('click', function () {
        if (!ambient) {
          return;
        }
        ambient.muted = !ambient.muted;
        muteBtn.textContent = ambient.muted ? 'Unmute' : 'Mute';
      });
      controller.appendChild(muteBtn);

      var volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.min = 0;
      volumeSlider.max = 1;
      volumeSlider.step = 0.05;
      volumeSlider.value = 0.5;
      volumeSlider.addEventListener('input', function () {
        if (!ambient) {
          return;
        }
        ambient.volume = parseFloat(volumeSlider.value);
      });
      controller.appendChild(volumeSlider);
      document.body.appendChild(controller);

      // Play hover sound when hovering over interactive elements.
      document.addEventListener('mouseover', function (e) {
        if (!hoverSound) {
          return;
        }
        if (e.target.closest('a, button')) {
          hoverSound.currentTime = 0;
          hoverSound.play().catch(function(){});
        }
      });

      // Play transition sound when page transition overlay is activated.
      document.addEventListener('transitionstart', function (e) {
        if (!transitionSound) {
          return;
        }
        if (e.target.classList && e.target.classList.contains('page-transition')) {
          transitionSound.play().catch(function(){});
        }
      });

      // Play whisper sound when a silhouette starts its animation.
      document.body.addEventListener('animationstart', function (e) {
        if (!whisperSound) {
          return;
        }
        if (e.target.classList.contains('silhouette')) {
          whisperSound.currentTime = 0;
          whisperSound.play().catch(function(){});
        }
      });
    }
  };
})(Drupal, drupalSettings);
