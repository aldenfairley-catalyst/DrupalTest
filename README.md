# Mulholland Dream local environment

This repository contains the **Mulholland Dream** Drupal theme together with a lightweight Docker toolchain that makes it easy to boot a full Drupal site locally for previewing and development.

The steps below were written and verified on Ubuntu Linux, but they will work on any platform that can run Docker Desktop or the Docker Engine and Compose plugin.

## Prerequisites

Make sure the following tools are installed on your workstation:

- [Docker Engine](https://docs.docker.com/engine/install/) **and** the Docker Compose plugin (`docker compose` command).
- [Node.js](https://nodejs.org/en/download) 18 or newer (required for compiling the theme SCSS).
- `npm` (ships with Node.js).

If you already have Node.js, install the Node dependencies for the Sass build once:

```bash
npm install
```

This installs the local `sass` CLI used by the build scripts defined in [`package.json`](./package.json).

## Quick start

1. **Boot the infrastructure.**
   ```bash
   docker compose up -d
   ```
   The first run copies Drupal core into a shared Docker volume and launches two containers:
   - `drupal` – Drupal 10 running on Apache.
   - `db` – MariaDB 10.6 for persistent storage.

2. **Install required Drupal packages.** The Mulholland Dream theme extends the contrib `bootstrap5` base theme and the setup guides use Drush. Pull both packages into the running site with Composer:
   ```bash
   docker compose run --rm composer composer require drupal/bootstrap5:^1.1 drush/drush:^12.0 --prefer-dist --no-interaction
   ```
   > The command runs inside a temporary Composer container that shares the Drupal document root.

3. **Install Drupal.** You can use the browser-based installer at [http://localhost:8080](http://localhost:8080) or run the automated Drush install below. The Drush option creates an administrator account (`admin` / `admin`) and connects to the database that is defined in `docker-compose.yml`.
   ```bash
   docker compose exec drupal php vendor/bin/drush site:install standard \
     --account-name=admin \
     --account-pass=admin \
     --db-url=mysql://drupal:drupal@db/drupal \
     -y
   ```

4. **Enable the Mulholland Dream theme.**
   ```bash
   docker compose exec drupal php vendor/bin/drush theme:enable mulholland_dream -y
   docker compose exec drupal php vendor/bin/drush config-set system.theme default mulholland_dream -y
   ```
   The custom theme lives in `web/themes/custom/mulholland_dream` and is bind-mounted into the Drupal container. Any edits you make on the host are reflected immediately inside the running site.

5. **Compile the theme assets.** The repository ships with source SCSS under `web/themes/custom/mulholland_dream/scss`. Build once after cloning and whenever you change the SCSS:
   ```bash
   npm run build
   ```
   For iterative work you can keep the watcher running:
   ```bash
   npm run watch
   ```
   The compiled CSS is written to `web/themes/custom/mulholland_dream/css/style.css`, which Drupal loads via the theme library definition.

6. **Visit the site.** Browse to [http://localhost:8080](http://localhost:8080) and log in with the administrator credentials. Navigate to **Appearance → Mulholland Dream** to verify that it is the default theme. The header, footer, and imagery configured in the theme will be immediately visible on any Drupal page.

## Front-end behaviours at a glance

Mulholland Dream ships with several Drupal behaviours that lean on shared settings. Understanding how they interact will help when tweaking or extending the theme:

- **`mulholland_dream_preprocess_html()`** attaches `drupalSettings.mulhollandDream` which exposes the public theme path (`themePath`) and a default visual variation (`defaultVariation`). JavaScript can therefore build asset URLs without hard-coding them and keep the look & feel consistent across navigations.
- **`js/variations.js`** reads the `style` query parameter first, then the `defaultVariation` from `drupalSettings`, and finally randomises the look if neither is supplied. Its companion stylesheet (`css/variations.css`) scopes rules under `.theme-<variation>`.
- **`js/randomizer.js`** and **`js/audio.js`** both use `themePath` to locate imagery and ambient audio. They also respect overrides provided via `drupalSettings.mulhollandDream.randomElements` should a module wish to supply custom assets.
- **`js/scroll-effects.js`** coordinates parallax scrolling, reveal animations, and page transitions. When `IntersectionObserver` is not available, it falls back to a no-animation mode so that content is still displayed.
- **`js/color-transition.js`** and **`js/cursor.js`** focus on subtle ambient effects—colour gradients and a custom cursor respectively—and bail out automatically when the user’s device or preferences would be negatively impacted (e.g. `prefers-reduced-motion`).

If you extend any of these behaviours, prefer enriching the shared `drupalSettings.mulhollandDream` namespace in PHP. This keeps all dynamic configuration in one place and ensures Ajax responses inherit the same defaults.

## Day-to-day commands

- Stop and remove the containers (but keep the database and Drupal files in Docker volumes):
  ```bash
  docker compose down
  ```
- Reset everything (drops the database and removes the Drupal volume):
  ```bash
  docker compose down -v
  ```
- Run Drupal or Composer commands:
  ```bash
  docker compose exec drupal php vendor/bin/drush status
  docker compose run --rm composer composer update
  ```

## Troubleshooting

- **Permission issues when installing Drupal** – If the browser installer complains that `sites/default` is not writable, run:
  ```bash
  docker compose exec drupal chown -R www-data:www-data sites/default
  ```
  The official Drupal image usually fixes permissions automatically, but the command above resolves any lingering problems.

- **Composer cannot download packages** – Ensure the host has outbound HTTPS access. If you are behind a proxy, configure it on the host and re-run the `docker compose run --rm composer …` command.

- **Theme changes are not visible** – Confirm that you rebuilt the CSS (`npm run build`) and clear Drupal caches:
  ```bash
  docker compose exec drupal php vendor/bin/drush cache:rebuild
  ```

With these steps completed you have a fully functional local environment for exploring and developing the Mulholland Dream Drupal theme.

