# Consulting site

Public professional surface. A stranger might hire. They hire competence, which
here means **direct and innovative**, not a brochure.

This should be a website worth pointing at — the example, not a quieter copy
of Autogram / Lullabot / a help policy. Show what you can do. Walls of text
are the anti-pattern we already felt.

Pages are jobs in `pages.md`. What we actually have is in `inventory.md`.
Code can live here (or a sibling app) when a job is clear enough to try. Notes
still lead; they do not freeze the build.

## This is

- Hire-me through craft: space, problem sets, a lesson that can become a
  conversation
- Impressions: why someone would act, so the Site is not a wall of text they
  have to survive
- Voice: specific and checkable when stating facts; playful when the
  experience needs it
- A home for linking books when they exist
- Allowed to use ink, Three.js, story, easter eggs, AI — if they show
  competence and teach something

## This is not

- Fake clients, fake metrics, placeholder headshots, invented testimonials
- A Jacobian-style door that lists what I will not do
- A services grid of synonyms for “I write code”
- A second Mick / personal-ops system
- Trojan Tech or any convening play

Garden, shipping container, visual novel, home automation are playground
until they demonstrate a problem set. Then they can graduate. They are not
banned from the professional surface by genre.

## Serving

Static host only. No application server that renders a new document per request.

A URL is not required to be one HTML file. The app may assemble a view from
files that already exist on the host. A user action can load another static
asset: an HTML fragment, JS, CSS, JSON, CSV, or anything else the host will
serve as a file. An HTML file is not automatically a page.

Default content still has to stand on first request. Extra files are for
states someone asked for.

## Default and opt-in

You cannot force a visitor to play. The first response is the ordinary web:
readable, complete, a bit boring on purpose. That backup is required.

If they take an Impression — select a box, apply a variant, open a nested
slot — the Experience can deepen. Better UX is successive, not the landing
state. No tour before the first click. No locked door if they never click.

## Component variants

A **variant** is a named rendering of a component: style plus which content is
included. It is not a user profile and not a site-wide personality.

The same component can appear on the first response and in later files. A click
asks for another authored file. The client keeps only the node that matches a
CSS selector and swaps it onto the existing target. HTMX does this with
`hx-get` + `hx-target` + `hx-select`. Stimulus (or a small controller next to
Turbo) does the same job: fetch the file, `querySelector` the component, replace
the target. The response may be a full HTML document; only the selected node
lands on the page.

That is why variants stay static. Each file is already the component in that
state — classes, tokens, and the blocks that belong in that reading. The host
does not compute a new personality. It hands over a file that was written ahead
of time.

`localStorage` may remember the last variant a browser chose. The URL may name
it if the reading should be shareable. Neither source invents the markup.

## Split from the playground

`~/Sites/personal/content` stays the informal lab (https://alexfinnarn.github.io/).
It already has real essays and a `/work` page that reads like a template. Do
not “fix” `/work` in place as the consulting site.

Graduate work onto this Site when it is good enough for a stranger. Copy,
link, or rebuild — later choice, per piece.

## Open on purpose

The offer is still forming. Résumé title is still “Senior Full Stack
Engineer.” Consulting is the posture. Next work is Home that makes someone
stay, Problem Sets that are not a résumé, a Lesson that is not a generic
form — and impressions a stranger might actually take.
