---
theme: paper
nav: problems
title: "Problems I solve"
dek: "Four shapes of mess. Each one is something I have actually been inside, with the engagement named. If yours looks like one of these, the case studies go deeper."
description: "Four classes of mess I am good at, with the engagements that prove it."
---

<section class="problem-block" id="outgrown">

## A CMS that outgrew its shape

The platform was right when it was built. Then it absorbed fifteen years of
exceptions — a module for one department, a content type for one campaign, a
workaround nobody documented. Now every change is expensive and nobody can
say why.

**What I do:** understand why each strange thing is there before removing it.
Most of them were load-bearing once, and a few still are. The work is
separating the exceptions that encode a real requirement from the ones that
encode a person who left.

- Features across roughly fifteen Drupal sites on one federal platform (CivicActions)
- Drupal 7 family of sites and the start of the D8 platform (Highlights for Children)
- Drupal 7 multisite for Ethicon, coordinating an offshore team of four (Sogeti)
- Maintenance across 15–20 client sites, and the follow-on performance and SEO work that came out of it (Coplex)

I have written about the underlying view at length:
[Intent over Implementation](https://alexfinnarn.github.io/writing/011-cms-intent-over-implementation)
and [Content Over Complexity](https://alexfinnarn.github.io/writing/012-cms-content-complexity).

</section>

<section class="problem-block" id="migration">

## A migration that cannot lose content or money

The system has to keep running while it moves. Donations keep processing,
editors keep publishing, and there is no maintenance window anyone will
approve. The rollback plan matters more than the migration script.

**What I do:** find the seam. Usually the fix is not moving the whole thing at
once but splitting it along a boundary that should have existed anyway — so
that if half of it fails, the other half does not care.

- Separated content management from payment processing on a platform moving ~$5.4M a year, using domain-driven design (University of Colorado)
- Drupal-to-Drupal migration on the Migrate API across a federal estate (CivicActions)

<ul class="cases">
  <li><a class="case-link" href="{{HOME}}cases/cu-giving.html"><strong>Splitting a giving platform from its CMS</strong><span>University of Colorado · 2020–2022</span></a></li>
</ul>

</section>

<section class="problem-block" id="publishing">

## Publishing too slow to matter

When fixing a typo requires a deploy, editors stop trusting the system. They
route around it — a PDF here, a third-party tool there — and within a year the
real content lives somewhere you do not control.

**What I do:** treat it as a workflow problem, because it is one. The
technical answer (decouple, cache, an API) only helps if it actually shortens
the loop between an editor deciding something and a reader seeing it.

- Accelerated publishing for the VA: decoupled Drupal, JSON:API, and a Next/React front end (CivicActions)
- Upgraded an Ionic/Angular Medicare mobile app under a hard deadline (CivicActions)

<ul class="cases">
  <li><a class="case-link" href="{{HOME}}cases/va-publishing.html"><strong>Accelerated publishing at the VA</strong><span>CivicActions · 2022–2024</span></a></li>
</ul>

</section>

<section class="problem-block" id="floor">

## A team that cannot reproduce its own bugs

Fifty repositories, a thousand sites, and every developer on a slightly
different machine. Half of every standup is spent establishing whether a thing
is broken or just broken locally.

**What I do:** fix the floor before the features. Shared environments, real
CI, and a test story QA and development both believe. It is unglamorous and it
is usually the highest-leverage thing available.

- Continuous integration across 50+ repositories (University of Colorado)
- Shared local environments, Vagrant then Docker, for a distributed team
- A Vue UI deploying to more than 1,000 sites
- Cypress and Jenkins liaison between development and QA (CivicActions)
- Kanban and Theory of Constraints for flow; Architectural Decision Records so the reasoning survives the person

<ul class="cases">
  <li><a class="case-link" href="{{HOME}}cases/cu-tooling.html"><strong>Tooling for 1,000+ sites</strong><span>University of Colorado · 2015–2019</span></a></li>
</ul>

</section>

## Where this came from

The full chronology, if you would rather read it that way.

<ul class="history wide">
  <li><span class="when">2022–2024</span><span class="what"><strong>CivicActions</strong> — Senior Backend Drupal Engineer <span>Federal content platforms for the VA and CMS. Decoupled publishing, ~15 Drupal sites, Migrate API work, Ionic/Angular mobile, Cypress/Jenkins, accessibility (edX certificate). Speaker at three regional conferences on test automation and frontend.</span></span></li>
  <li><span class="when">2020–2022</span><span class="what"><strong>University of Colorado</strong> — online giving platform <span>~$5.4M/year. Led the domain-driven migration separating content management from payment processing. Kanban, Theory of Constraints, Architectural Decision Records.</span></span></li>
  <li><span class="when">2015–2019</span><span class="what"><strong>University of Colorado</strong> — platform and tooling <span>Vue UI to 1,000+ sites. CI across 50+ repositories. Shared local environments (Vagrant, then Docker).</span></span></li>
  <li><span class="when">2019</span><span class="what"><strong>Highlights for Children</strong> <span>Drupal 7 family of sites; start of the Drupal 8 platform.</span></span></li>
  <li><span class="when">2014–2015</span><span class="what"><strong>Coplex</strong> — contractor to maintenance team lead <span>15–20 clients. Sold follow-on performance and SEO packages.</span></span></li>
  <li><span class="when">2013–2014</span><span class="what"><strong>Sogeti</strong> — Ethicon (Johnson &amp; Johnson) <span>Drupal 7 multisite; coordinated an offshore team of four.</span></span></li>
  <li><span class="when">2009</span><span class="what"><strong>Ohio State University</strong> <span>BS, Psychology. More relevant to content modeling than it sounds.</span></span></li>
</ul>

<p><a class="more" href="{{HOME}}contact.html">Recognize one of these? →</a></p>
