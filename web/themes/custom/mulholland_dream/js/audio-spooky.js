/**
 * @file audio-spooky.js
 * Plays a looping ambient track with a custom reverb effect to create
 * an unsettling atmosphere. Uses the Web Audio API to construct a
 * convolution-based reverb from decaying noise, following guidance from
 * Web Audio documentation on ConvolverNode usage. The sound initialises on
 * the first user interaction to respect autoplay restrictions. If the
 * configured audio file is missing the behaviour falls back to an included
 * ambient track so the feature never throws a network error.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandSpookyAudio = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }
      if (document.body.dataset.spookyAudioLoaded) {
        return;
      }
      document.body.dataset.spookyAudioLoaded = 'true';

      var audioContext;
      var midiElement;

      /**
       * Resolves the base path for theme assets using drupalSettings or
       * Drupal.theme.path. Ensures the returned path starts and ends with
       * a slash.
       */
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

      /**
       * Normalises the configured spooky track. Accepts absolute URLs or
       * paths relative to the theme directory and falls back to the bundled
       * ambient loop.
       *
       * @param {string} themePath
       *   Normalised theme path with trailing slash.
       * @returns {{primary: string, fallback: string}}
       *   URLs for the configured track and the guaranteed fallback.
       */
      function resolveTrack(themePath) {
        var fallback = themePath + 'audio/ambient_hum.wav';
        var configured = settings.mulhollandDream && settings.mulhollandDream.spookyTrack;
        if (typeof configured !== 'string' || !configured.trim()) {
          return { primary: fallback, fallback: fallback };
        }
        var trimmed = configured.trim();
        if (/^https?:\/\//i.test(trimmed)) {
          return { primary: trimmed, fallback: fallback };
        }
        if (trimmed.charAt(0) === '/') {
          return { primary: trimmed, fallback: fallback };
        }
        return { primary: themePath + trimmed, fallback: fallback };
      }

      /**
       * Builds a simple impulse response buffer consisting of decaying noise.
       * Based on examples of ConvolverNode usage【657865512580247†L219-L223】, this generates
       * random noise whose amplitude decays exponentially over time.
       *
       * @param {AudioContext} context The current AudioContext.
       * @param {number} duration Duration of the impulse in seconds.
       * @param {number} decay Exponential decay factor; higher values yield
       *        longer reverb tails.
       * @returns {AudioBuffer} A stereo impulse response buffer.
       */
      function createReverbBuffer(context, duration, decay) {
        duration = duration || 3;
        decay = decay || 2.0;
        var sampleRate = context.sampleRate;
        var length = sampleRate * duration;
        var impulse = context.createBuffer(2, length, sampleRate);
        for (var channel = 0; channel < 2; channel++) {
          var channelData = impulse.getChannelData(channel);
          for (var i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
          }
        }
        return impulse;
      }

      /**
       * Initialises the reverb and begins playing the configured track on
       * first click.
       */
      function initSpookyAudio() {
        if (midiElement) {
          return;
        }
        var themePath = resolveThemePath();
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          // Web Audio API not supported.
          document.removeEventListener('click', initSpookyAudio);
          return;
        }
        // Create a hidden audio element to host the spooky soundtrack.
        midiElement = document.createElement('audio');
        var track = resolveTrack(themePath);
        var activeTrack = track.primary;
        midiElement.src = activeTrack;
        midiElement.loop = true;
        midiElement.style.display = 'none';
        document.body.appendChild(midiElement);
        midiElement.addEventListener('error', function handleError() {
          if (activeTrack === track.fallback) {
            midiElement.removeEventListener('error', handleError);
            return;
          }
          activeTrack = track.fallback;
          midiElement.src = track.fallback;
          midiElement.load();
          midiElement.play().catch(function () {});
        });
        // Set up the audio graph: source -> convolver -> destination.
        var source = audioContext.createMediaElementSource(midiElement);
        var convolver = audioContext.createConvolver();
        convolver.buffer = createReverbBuffer(audioContext, 5, 3.5);
        source.connect(convolver);
        convolver.connect(audioContext.destination);
        midiElement.volume = 0.3;
        // Attempt to play; ignore failures to satisfy autoplay policies.
        midiElement.play().catch(function(){});
        document.removeEventListener('click', initSpookyAudio);
      }
      // Defer initialisation until the first user click to satisfy
      // autoplay policies.
      document.addEventListener('click', initSpookyAudio);
    }
  };
})(Drupal, drupalSettings);