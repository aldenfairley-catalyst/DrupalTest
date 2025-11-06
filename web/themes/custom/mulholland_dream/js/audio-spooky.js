/**
 * @file audio-spooky.js
 * Plays a looping MIDI file with a custom reverb effect to create
 * an unsettling ambience. Uses the Web Audio API to construct a
 * convolution-based reverb from decaying noise, following guidance from
 * Web Audio documentation on ConvolverNode usage【657865512580247†L185-L188】. The sound
 * initialises on the first user interaction to respect autoplay
 * restrictions. If MIDI playback is unsupported, it fails gracefully.
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
       * Initialises the reverb and begins playing the MIDI file on first click.
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
        // Create a hidden audio element to host the MIDI file.
        midiElement = document.createElement('audio');
        midiElement.src = themePath + 'audio/Ive-Told-Evry-Little-Star.mid';
        midiElement.loop = true;
        midiElement.style.display = 'none';
        document.body.appendChild(midiElement);
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