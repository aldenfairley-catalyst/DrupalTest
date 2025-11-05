# A Comprehensive Specification for the "Silencio" Artifice

## Introduction to the Mandate

Herein, we chronicle the grand and terrible design of the **Silencio** project. This document serves as the singular compact, binding the autonomous agent (hereinafter **“the Artificer”**) to its task: to construct a digital edifice—a **Drupal 10/11 theme**—that gives form to the unquiet, surrealist neo‑noir nightmare of *Mulholland Drive*.

This specification is divided into two shadowed halves: **the Dream** (Functional & Design Specification) and **the Reality** (Technical Specification & Execution Plan). The division is deliberate: as in the film, surface logic belies the complex and sorrowful machinery that grinds beneath.

---

## Table 1.1.1 — Document Register

| Property       | Value                                                     | Gothic Comment                                                             |
| -------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| Document Title | A Comprehensive Specification for the "Silencio" Artifice | Its given name, to be whispered in shadow.                                 |
| Version        | **1.0 (The Incarnation)**                                 | The first of its line; others may follow, each more haunted than the last. |
| Project        | **Mulholland Dream (Drupal Theme)**                       | The vessel for the phantasm.                                               |
| Author         | **The Creative Technologist**                             | The hand that guides the planchette.                                       |
| Stakeholders   | **The User (The Auteur), The Artificer (The AI Agent)**   | The parties bound by this blood‑simple contract.                           |
| Change Log     | See **Appendix A**                                        | A record of all transmutations, lest we forget what has been altered.      |

---

# Part I. The Dream (*Speculum Functionalis*)

## 1.1 Purpose

**Business Need.** A hyper‑stylized, narrative‑driven presence that is itself a piece of art cinema: a site that breathes with *ephemeral cinematic poetry* and the themes of Hollywood as merciless and destructive.

**Document Purpose.** This FSD translates the abstract Mulholland Drive aesthetic into concrete site functions and use cases.

## 1.2 User Personas & Use Cases (*The Cast of Specters*)

### Persona 1: **The Seeker (Betty)**

*An anonymous first‑time visitor; hope‑bright, unwise to the hidden gears.*

* **UC‑1.1**: Land on a homepage with a full‑screen mood‑drenched hero and an enigmatic tagline.
* **UC‑1.2**: Navigate to **The Casting Call** (/gallery) to see headshots (artworks).
* **UC‑1.3**: Read **The Libretto** (/libretto) for the site’s philosophical voice.
* **UC‑1.4**: Find **The Blue Box** (/contact) to send a message into the void.

### Persona 2: **The Curator (Diane)**

*Administrator; the hidden hand that knows the grim backend reality.*

* **UC‑2.1**: Log in via **/user/login**.
* **UC‑2.2**: Create/edit/delete **Visages** (Gallery content type).
* **UC‑2.3**: Create/edit/delete **Verses** (Blog/Libretto content type).
* **UC‑2.4**: Review messages from **The Blue Box** (contact form submissions).

## 1.3 Core Functional Requirements (R‑F)

### R‑F1: **Homepage — The View from the Drive**

* Full‑bleed, responsive hero image **hero.001.jpg**.
* Site Title **“Silencio”** and Shakespearean tagline overlaid.
* Primary navigation **main_nav** styled with **Bootstrap 5** components.

### R‑F2: **The Gallery — The Casting Call**

* Page at **/gallery** rendering a responsive **Bootstrap grid** of **Visage** nodes.
* Each tile links to its full **Visage** node.

### R‑F3: **The Libretto — The Script**

* Page at **/libretto** listing **Verse** teasers (title + summary) via a View.

### R‑F4: **The Blue Box — Contact**

* Page at **/contact** using core Contact form: Name, Email, Message.
* Submit button styled as a small **blue key** motif.

### R‑F5: **The Stage — Footer**

* Persistent footer region across all pages.
* Minimal content; themed as **Club Silencio** stage.

## 1.4 Constraints, Assumptions, Dependencies

**Constraints (Bindings).**

* Theme must be a **sub‑theme** of contrib **bootstrap5**.
* Fully responsive using **Bootstrap 5** grid/utilities.
* **No jQuery** dependencies.
* All **comments** in `*.yml`, `*.css`, `*.twig` written in **early 19th‑century Gothic**.
* All **user‑facing copy** in **Shakespearean** style.

**Assumptions (Articles of Faith).**

* Artificer has access to AI image generation (MJ v6, SDXL, DALL·E, etc.).
* Artificer can run shell commands, Composer, DDEV.

**Dependencies (External Spirits).**

* **Drupal Core** ^10 or ^11
* **drupal/bootstrap5** 4.0.x
* **DDEV + Docker** available locally

## 1.5 Acceptance Criteria

* **AC‑1**: R‑F1…R‑F5 implemented and verifiable.
* **AC‑2**: `mulholland_dream` installs/enables as default sub‑theme of bootstrap5.
* **AC‑3**: All theme files contain Gothic comments.
* **AC‑4**: All user‑facing content rendered in Shakespearean style (Part V).
* **AC‑5**: All generated images exist under `/images` and display correctly.
* **AC‑6**: Site is fully responsive at Bootstrap breakpoints.

---

# Part II. The Visage (*Speculum Designationis*)

## 2.1 Thematic Core & Motifs

| Cinematic Motif             | UI/Theme Implementation                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **The Blue Box & Key**      | **/contact** becomes The Blue Box; submit button uses a blue key icon; background uses `$color-transition-key`. |
| **Club Silencio**           | Global footer region styled as stage using **bg.001.jpg** (red curtains, chevron floor).                        |
| **Red Curtains**            | 10px vertical border image on left/right of main content via **asset.001.png**.                                 |
| **The View from the Drive** | Full‑bleed homepage hero **hero.001.jpg**.                                                                      |
| **Betty (Innocence)**       | Default `<a>` color and hover flashes of pink (`$color-dream-betty`).                                           |
| **Diane (Reality)**         | Base typography `$color-wraith` on `$color-shadow/$color-void` backgrounds.                                     |

## 2.2 Color Palette & Typography (SASS)

```scss
// scss/_variables.scss — A libram of forbidden colors and fonts.
$color-void:           #0a0a0a; // The sepulchral black of the night between stars; the void in the box.
$color-wraith:         #f0f0f0; // A pale, ghostly white for the text that speaks of sorrow.
$color-shadow:         #181818; // The color of a room where a terrible secret is kept.
$color-transition-key: #001f8b; // The baleful, electric blue of the Key and the Box.
$color-danger-curtain: #8B0000; // A deep, ominous red, like old velvet and new blood.
$color-dream-betty:    #FFC0CB; // A sickly, naive pink; the color of false hope and the jitterbug.

$font-primary: 'Georgia', serif;             // A classic serif for sorrowful letters.
$font-heading: 'Playfair Display', serif;    // Ornate, high‑contrast, dreadful drama.
```

**Core Styles**

```scss
// scss/style.scss — The primary incantation.
@import 'variables';

body {
  background-color: $color-shadow; // {gothic} A chamber where whispers cling to the walls.
  color: $color-wraith;
  font-family: $font-primary;
}

h1, h2, h3 {
  font-family: $font-heading; // {gothic} Titles fit for mournful proclamations.
  color: $color-wraith;
}

a {
  color: $color-dream-betty; // {gothic} A naive flare in the dark.
}
a:hover { color: lighten($color-dream-betty, 15%); }

.region-footer {
  background: url('../images/bg.001.jpg') center/cover no-repeat;
  padding: 2rem;
  border-top: 5px solid $color-danger-curtain; // {gothic} The curtain’s hem, stained with memory.
}

.main-content-wrapper {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  -webkit-border-image: url('../images/asset.001.png') 30 stretch;
  border-image: url('../images/asset.001.png') 30 stretch; // {gothic} The stage’s red drapery frames the illusion.
}

.navbar-dark .navbar-nav .nav-link { color: $color-wraith; }
.navbar-dark .navbar-nav .nav-link:hover { color: $color-dream-betty; }
```

## 2.3 The Prompt Libram (AI Image Generation)

| Asset ID             | Description         | Prompt                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **hero.001.jpg**     | Homepage Hero       | cinematic film still, the view from Mulholland Drive at night, sprawling Los Angeles city lights seen from a dark, winding road, an oppressive sense of dread, style of David Lynch, neo‑noir, chiaroscuro lighting, 35mm film grain, deep shadows, electric blue and sickly yellow — **16:9** |
| **motif.001.png**    | The Blue Key        | isolated uncanny blue key with trefoil head on dark red velvet, macro, faint electric blue glow, Mulholland Drive (2001), **1:1**, transparent background                                                                                                                                      |
| **motif.002.jpg**    | The Blue Box        | enigmatic dark blue lacquered box with strange keyhole on dark wood, low‑key lighting, film noir, humming with terrible secret, David Lynch, **4:3**                                                                                                                                           |
| **bg.001.jpg**       | Club Silencio Stage | dim stage, heavy red velvet curtains, stark black‑white chevron floor, empty microphone, uncanny, “No hay banda”, **16:9**                                                                                                                                                                     |
| **portrait.001.jpg** | “Betty”             | haunting blonde, naive yet shadow‑touched, 1950s Hollywood glamour portrait (Naomi Watts vibe), soft pink filter, dreamlike, **3:4**                                                                                                                                                           |
| **portrait.002.jpg** | “Rita”              | mysterious brunette, amnesiac gaze (Laura Harring vibe), low‑key, deep shadows, holding a single blue key, **3:4**                                                                                                                                                                             |
| **portrait.003.jpg** | Man Behind Winkie’s | monstrous vagrant behind alley wall, extreme contrast b/w, surreal horror, jump‑scare, **1:1**                                                                                                                                                                                                 |
| **asset.001.png**    | Red Curtain Border  | seamless tileable vertical red velvet curtain, deep shadow, theatrical **1:4**, tileable                                                                                                                                                                                                       |

---

# Part III. The Reality (*Machinamentum Technicum*)

## 3.1 Theme Architecture

**Foundation.** `mulholland_dream` as a **bootstrap5** sub‑theme.

**Structure.**

```
web/
└─ themes/
   └─ custom/
      └─ mulholland_dream/
         ├─ mulholland_dream.info.yml
         ├─ mulholland_dream.libraries.yml
         ├─ mulholland_dream.breakpoints.yml
         ├─ css/
         │  └─ style.css
         ├─ scss/
         │  ├─ _variables.scss
         │  └─ style.scss
         ├─ js/
         ├─ images/
         └─ templates/
            ├─ layout/
            │  └─ page.html.twig
            ├─ node/
            │  └─ node--visage.html.twig
            └─ block/
               └─ block--system-branding-block.html.twig
```

## 3.2 `mulholland_dream.info.yml`

```yaml
# mulholland_dream.info.yml
# Here lies the phylactery of our theme, binding soul to system.

name: Mulholland Dream
type: theme
base theme: bootstrap5
core_version_requirement: ^10 || ^11

description: 'A theme of dreams, dread, and duality, summoned from the film Mulholland Drive.'

libraries:
  - mulholland_dream/global-styling

regions:
  header: 'Header'         # {gothic} The attic, where the name echoes.
  nav_primary: 'Primary Navigation' # {gothic} A hallway of choices.
  content: 'Main Content'  # {gothic} The grand stage of tragedy.
  sidebar: 'Sidebar'       # {gothic} A sealed passage.
  footer: 'Footer (Silencio)' # {gothic} The cellar where the curtains hang.
```

## 3.3 `mulholland_dream.libraries.yml`

```yaml
# mulholland_dream.libraries.yml
# A scroll binding the phantasmal energies of style.

global-styling:
  version: 1.0
  css:
    theme:
      css/style.css: {}
  dependencies:
    - bootstrap5/global-styling
```

## 3.4 Twig Transmutations (Template Overrides)

> **Enable Twig debug** for validation in `web/sites/development.services.yml`:
> `twig.config: { debug: true, auto_reload: true, cache: false }`

### `templates/layout/page.html.twig`

```twig
{# A dreadful container, to hold the fleeting dreams of the user. #}
<header role="banner">
  {{ page.header }}
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        {{ page.nav_primary }}
      </div>
    </div>
  </nav>
</header>

<main role="main" class="container-fluid">
  <div class="row justify-content-center">
    <div class="col-12 col-xl-9 main-content-wrapper py-4">
      {{ page.content }}
    </div>
  </div>
</main>

<footer class="region-footer mt-5" role="contentinfo">
  {{ page.footer }}
</footer>
```

### `templates/node/node--visage.html.twig`

```twig
{# A face in the dark; let metadata fall away like ash. #}
<article{{ attributes.addClass('card','bg-dark','border-0','text-center','shadow') }}>
  {% if node.field_visage_image.entity is not empty %}
    <div class="card-img-top">
      {{ content.field_visage_image }}
    </div>
  {% endif %}
  <div class="card-body">
    <h2 class="card-title h4 text-light">{{ label }}</h2>
    {# No author, no date; only the visage remains. #}
  </div>
</article>
```

### `templates/block/block--system-branding-block.html.twig`

```twig
{# The site’s true name, spoken once and binding. #}
{% if site_name %}
  <h1 class="display-6 fw-bold" style="font-family:'Playfair Display',serif;">
    {{ site_name }}
  </h1>
{% endif %}
```

---

# Part IV. The Artificer’s Executable Plan

## Phase 1 — The Incantation (Environment)

```bash
mkdir mulholland-site && cd mulholland-site

ddev config --project-type=drupal10 --docroot=web --create-docroot
ddev start

ddev composer create "drupal/recommended-project:^10" --no-install
ddev composer install

ddev composer require drupal/bootstrap5:^4.0 drush/drush

ddev drush site:install -y --account-name=admin --account-pass=admin

ddev launch
```

**Verify:** HTTP 200 on the DDEV URL; login with `admin/admin`.

## Phase 2 — The Summoning (Scaffold & Enable)

```bash
cd web/themes/custom
mkdir -p mulholland_dream/{css,scss,js,images,templates/{layout,node,block}}

# Create files per §3.2–3.3 and compile SASS to css/style.css.

ddev drush theme:enable bootstrap5
ddev drush theme:enable mulholland_dream
ddev drush config:set system.theme default mulholland_dream -y
ddev drush cr
```

## Phase 3 — The Sculpting (Assets & Styles)

1. Generate each image in **§2.3** and place in `images/` with exact IDs.
2. Apply styles from **§2.2**; ensure footer background and curtain borders render.
3. Copy and modify Twig templates from **§3.4**; include Gothic comments.
4. `ddev drush cr`.

## Phase 4 — The Voice (Content & Views)

**Content Types** *(choose one method per environment)*:

* **Via UI**: *Structure → Content types → Add content type* (Visage, Verse).
* **Via Drush Generate** (canonical):

```bash
# May require the Generator component depending on Drush ver.
ddev drush generate content-type --machine-name=visage --label="Visage" --description="A haunting visage for the gallery."
ddev drush generate content-type --machine-name=verse  --label="Verse"  --description="A verse from the site's libretto."

# Add an Image field to Visage (use UI or field storage commands as available)
# UI path: Structure → Content types → Visage → Manage fields → Add field (Image)
```

**Populate Content**

```bash
ddev drush config:set system.site name "Silencio" -y
ddev drush config:set system.site slogan "Hark! What light from yonder window breaks? 'Tis not the dawn, but L.A.'s burning heart." -y
```

Create nodes (UI recommended for images). For scripted load, save files via URL if served locally, then attach to Visage nodes.

**Create Views**

* **Gallery**: Page at `/gallery`, displays **Visage** as Bootstrap grid (field: image).
* **Libretto**: Page at `/libretto`, displays **Verse** teasers (title + summary).

## Phase 5 — The Finality (Validation)

* **AC‑1**: Visit `/`, `/gallery`, `/libretto`, `/contact` → HTTP 200.
* **AC‑2**: `/admin/appearance` shows **Mulholland Dream** as default.
* **AC‑3**: Grep theme for Gothic comments in `*.yml`, `*.twig`, `*.css`.
* **AC‑4**: Confirm site name/tagline & page copy match **Part V**.
* **AC‑5**: Confirm all images render in assigned regions.
* **AC‑6**: Inspect at XS/SM/MD/LG/XL breakpoints.

---

# Part V. The Libretto (*The Site’s Own Voice*)

## 5.1 Site‑Wide Elements

* **Site Name**: *Silencio*
* **Tagline**: *Hark! What light from yonder window breaks? 'Tis not the dawn, but L.A.'s burning heart.*

## 5.2 Page: The Libretto (/libretto, Node: Verse)

**Title:** *What Dreams May Come*

**Body (HTML):**

```html
<p>We are such stuff as dreams are made on; and our little life is rounded with a sleep. But what, pray, if the dream doth rot? What if the dreamer, lost within the folds of false renown, becomes a shade, a piteous wraith, to haunt the hills of this, our Hollywood?</p>

<p>Here, in this digital hall, we hold a mirror to that artifice. We seek the truth that lies beneath the paint and powder. This edifice is itself a 'Club Silencio'—all is recorded, all is a play of shadows. 'No hay banda!' There is no band. 'Tis all a tape. An illusion.</p>

<p>Perchance you came here as a 'Betty,' with hope to fill your eye? Alas, this road, this Mulholland Drive, leads only to the knowledge of 'Diane.' Look upon these visages, these ghosts of what might have been, and despair, or understand.</p>
```

## 5.3 Page: The Blue Box (/contact)

* **Page Title:** *The Blue Box*
* **Intro Above Form:** *What mystery dost thou possess? Inscribe thy query to the void, and chance what answer may return. The key, once turned, cannot be unturned. Speak thy mind, if thou dar'st.*
* **Submit Button Text:** *Unlock*

## 5.4 Gallery Content (Visage)

* **Visage 1 Title:** *The Naif (Betty)*
* **Visage 2 Title:** *The Amnesiac (Rita)*
* **Visage 3 Title:** *The Horror (Winkie’s)*

---

# Appendix A — Change Log

| Version | Date       | Author                    | Change                            |
| ------- | ---------- | ------------------------- | --------------------------------- |
| 1.0     | 2025‑11‑06 | The Creative Technologist | Initial incarnation; pact sealed. |

---

## Appendix B — Notes on Drush Variants

* Some CLI sequences in older references use shorthand (e.g., `drush then`, `drush cset`). Use equivalents on your Drush version.
* Programmatic creation of fields may require `drush field:storage:create` and `drush field:create` (Drupal 10+) or rely on UI.

## Appendix C — Compliance Checklist (Authoring)

* **Gothic Comments** present in `*.yml`, `*.twig`, `*.scss/css`.
* **Shakespearean Copy** only for user‑facing text.
* **No jQuery** assumptions; Bootstrap 5 only.
* **Images** match IDs and placements in §2.3.
* **Responsiveness** verified across breakpoints.

> *Finis.* The work is given to the machine; the curtain falls, and yet the stage remains.
