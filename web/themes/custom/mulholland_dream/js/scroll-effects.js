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
 * efficiency.
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

      // Parallax handler: adjust elements marked with data-parallax.
      var parallaxElems = document.querySelectorAll('[data-parallax]');
      function parallaxHandler() {
        var scrollTop = window.scrollY;
        parallaxElems.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
          var offset = scrollTop * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        });
      }
      window.addEventListener('scroll', parallaxHandler, { passive: true });

      // Reveal animations using IntersectionObserver.
      var reveals = document.querySelectorAll('.reveal');
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

      // Page transition overlay. Create it once and append to the body.
      var overlay = document.createElement('div');
      overlay.className = 'page-transition';
      document.body.appendChild(overlay);

      function handleClick(e) {
        var href = this.getAttribute('href');
        if (!href) {
          return;
        }
        // Ignore in-page anchors, mailto links and JS links.
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
          return;
        }
        e.preventDefault();
        // Activate overlay and navigate after a delay.
        overlay.classList.add('active');
        setTimeout(function () {
          window.location.href = href;
        }, 500);
      }

      // Attach click listener to all links on the page.
      document.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', handleClick);
      });
    }
  };
})(Drupal, drupalSettings);