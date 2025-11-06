/**
 * @file interactive-menu.js
 *
 * Implements a drag‑to‑unlock floating menu for the Mulholland Dream theme.
 * The behaviour lazily constructs all required DOM elements on page load so
 * that no template changes are necessary.  A key appears in the lower
 * right corner of the screen; visitors must drag this key onto a lock
 * target on the lower left.  Once dropped, a set of navigation items
 * fade into view and float around the viewport.  Each item is
 * automatically decorated with an icon corresponding to its name.  All
 * images are resolved relative to the theme path exposed via
 * drupalSettings.mulhollandDream.themePath, allowing the theme to live
 * anywhere under the Drupal root without modifying this script.  To
 * avoid repeatedly initialising the menu on dynamic page inserts, a
 * flag is stored on the document body.
 */

(function (Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.mulhollandInteractiveMenu = {
    attach: function (context, settings) {
      // Only initialise once when attaching to the full document.  Early
      // return if this is not the top‑level context or if the menu has
      // already been loaded.
      if (context !== document) {
        return;
      }
      if (document.body.dataset.interactiveMenuLoaded) {
        return;
      }
      document.body.dataset.interactiveMenuLoaded = 'true';

      // Resolve the base theme path.  This value is provided by the
      // mulholland_dream_preprocess_html() hook.  Fallback to an empty
      // string if unavailable; relative paths will still work in most
      // configurations because this script and the images live in the same
      // directory hierarchy under the theme.
      var themePath = '';
      if (settings.mulhollandDream && settings.mulhollandDream.themePath) {
        themePath = settings.mulhollandDream.themePath;
      }

      // Create the smoke canvas if one does not already exist.  The
      // smoke‑effect.js behaviour animates this canvas when present.
      var existingCanvas = document.getElementById('smoke-canvas');
      if (!existingCanvas) {
        var canvas = document.createElement('canvas');
        canvas.id = 'smoke-canvas';
        canvas.className = 'smoke-canvas';
        document.body.appendChild(canvas);
      }

      // Construct the floating navigation container.  The menu starts
      // hidden; CSS transitions handle the fade in when the lock is
      // triggered.  Each item below contains a title, an icon name and a
      // link destination.  The links use simple hashes by default but can
      // be replaced with real paths if the corresponding pages exist.
      var nav = document.createElement('nav');
      nav.id = 'mainNav';
      nav.className = 'floating-menu hidden';
      var ul = document.createElement('ul');
      nav.appendChild(ul);
      var menuItems = [
        { title: 'Portal', icon: 'portal', href: '#' },
        { title: 'Labyrinth', icon: 'labyrinth', href: '#' },
        { title: 'Dreamscapes', icon: 'dream', href: '#' },
        { title: 'Whispers', icon: 'whisper', href: '#' },
        { title: 'Exit', icon: 'exit', href: '#' }
      ];
      menuItems.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'nav-item';
        li.setAttribute('data-icon', item.icon);
        var link = document.createElement('a');
        link.className = 'nav-link';
        link.href = item.href;
        link.textContent = item.title;
        li.appendChild(link);
        ul.appendChild(li);
      });
      document.body.appendChild(nav);

      // Create the drop zone (lock) at the bottom left.  This invites
      // visitors to drag the key here.  When the key is dropped on
      // this element the menu unlocks.
      var lock = document.createElement('div');
      lock.id = 'lock';
      lock.textContent = 'Place key';
      document.body.appendChild(lock);

      // Insert the draggable key at the bottom right.  The image path
      // derives from the theme path; if the theme path is empty the
      // browser resolves it relative to the current URL.  We set the
      // draggable attribute to true to enable the drag API.
      var keyImg = document.createElement('img');
      keyImg.id = 'key';
      keyImg.src = themePath + 'images/key.png';
      keyImg.alt = 'Key';
      keyImg.draggable = true;
      document.body.appendChild(keyImg);

      // Set up drag start/drag end handlers on the key.  We briefly
      // hide the key in its original position so that only the custom
      // drag image remains under the cursor.  A transparent pixel is
      // used as the drag image to avoid duplicating the key sprite.
      keyImg.addEventListener('dragstart', function (e) {
        setTimeout(function () {
          keyImg.classList.add('dragging');
        }, 0);
        var img = new Image();
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
        e.dataTransfer.setDragImage(img, 0, 0);
      });
      keyImg.addEventListener('dragend', function () {
        keyImg.classList.remove('dragging');
      });

      // Highlight the lock when the key is dragged over it.  Prevent
      // default behaviour to allow dropping.
      lock.addEventListener('dragover', function (e) {
        e.preventDefault();
      });
      lock.addEventListener('dragenter', function (e) {
        e.preventDefault();
        lock.classList.add('dragover');
      });
      lock.addEventListener('dragleave', function () {
        lock.classList.remove('dragover');
      });
      lock.addEventListener('drop', function (e) {
        e.preventDefault();
        lock.classList.remove('dragover');
        // Reveal the menu and remove the key and lock.  Use the
        // 'show' class to trigger CSS transitions.
        nav.classList.remove('hidden');
        nav.classList.add('show');
        if (keyImg.parentNode) {
          keyImg.parentNode.removeChild(keyImg);
        }
        if (lock.parentNode) {
          lock.parentNode.removeChild(lock);
        }
      });

      // Decorate each nav item with its icon.  The icons live in
      // themePath/images and share the same file name as the data‑icon
      // attribute.  Prepending the image to the link preserves the
      // existing text.
      var navItems = nav.querySelectorAll('.nav-item');
      navItems.forEach(function (item) {
        var iconName = item.getAttribute('data-icon');
        if (!iconName) {
          return;
        }
        var link = item.querySelector('.nav-link');
        if (!link) {
          return;
        }
        var icon = document.createElement('img');
        icon.src = themePath + 'images/' + iconName + '.png';
        icon.alt = iconName + ' icon';
        // Prepend the icon before the text.  Use insertBefore rather
        // than prepend() for IE11 compatibility (should Drupal still
        // support it).  However since Drupal 10 requires modern
        // browsers, we could also call link.prepend(icon).
        if (typeof link.prepend === 'function') {
          link.prepend(icon);
        }
        else {
          link.insertBefore(icon, link.firstChild);
        }
      });
    }
  };
})(Drupal, drupalSettings);