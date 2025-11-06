/**
 * @file scroll-effects.js
 * Implements parallax movement, reveal animations and simple page transitions.
 *
 * Parallax: Elements with a `data-parallax` attribute move vertically at
 * different speeds relative to the scroll position. The speed factor is
 * specified by the attribute value (e.g., data-parallax="0.5").
 *
 * Reveal: Elements with the `.reveal` class are hidden initially and become
 * visible when they enter the viewport. IntersectionObserver is used for
 * efficiency when available and gracefully skipped otherwise.
 *
 * Page transitions: Clicking on links triggers an overlay fade-out followed
 * by navigation to the link target. Internal anchors, mailto and JS links
 * are ignored. The overlay is defined in scroll-effects.css.
 */
(function (Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.mulhollandScrollEffects = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      }

      if (document.body.dataset.scrollEffectsLoaded) {
        return;
      }
      document.body.dataset.scrollEffectsLoaded = 'true';

      var prefersReducedMotion = false;
      if (window.matchMedia) {
        prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }

      // Reveal animations using IntersectionObserver when the API is available.
      var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
      if ('IntersectionObserver' in window && !prefersReducedMotion) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        reveals.forEach(function (el) {
          observer.observe(el);
        });
      }
      else {
        // Fallback: reveal elements immediately so that content is still accessible.
        reveals.forEach(function (el) {
          el.classList.add('visible');
        });
      }

      if (prefersReducedMotion) {
        return;
      }

      // Parallax handler: adjust elements marked with data-parallax.
      var parallaxElems = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
      function parallaxHandler() {
        var scrollTop = window.scrollY || window.pageYOffset || 0;
        parallaxElems.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
          var offset = scrollTop * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        });
      }
      if (parallaxElems.length) {
        window.addEventListener('scroll', parallaxHandler, { passive: true });
        parallaxHandler();
      }

      // Page transition overlay. Create it once and append to the body.
      var overlay = document.createElement('div');
      overlay.className = 'page-transition';
      document.body.appendChild(overlay);

      function handleLinkClick(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        var link = event.target.closest('a');
        if (!link || link.classList.contains('use-ajax')) {
          return;
        }

        var href = link.getAttribute('href');
        if (!href) {
          return;
        }
        if (link.hasAttribute('download')) {
          return;
        }
        var target = link.getAttribute('target');
        if (target && target !== '_self') {
          return;
        }
        if (link.dataset && link.dataset.noTransition !== undefined) {
          return;
        }
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
          return;
        }

        var destination;
        try {
          destination = new URL(href, window.location.href);
        }
        catch (error) {
          return;
        }
        if (destination.origin !== window.location.origin) {
          return;
        }
        if (destination.hash && destination.pathname === window.location.pathname && destination.search === window.location.search) {
          return;
        }

        event.preventDefault();
        overlay.classList.add('active');
        setTimeout(function () {
          window.location.href = destination.href;
        }, 500);
      }

      document.body.addEventListener('click', handleLinkClick);
    }
  };
})(Drupal, drupalSettings);
