---
theme: buff
nav: problems
kicker: "Case study · University of Colorado · 2015–2019"
title: "Tooling for 1,000+ sites"
dek: "A distributed team, more than fifty repositories, and over a thousand sites running the same platform. The hardest bug to fix is the one only one person can reproduce."
head_title: "Tooling for 1,000+ sites — Alex Finnarn"
description: "CI across 50+ repositories and local environments a distributed team could actually share."
---

<!-- Built only from inventory.md.
     TO DEEPEN: what the Vue UI actually did, how long a full CI run took
     before/after, team size, whether Vagrant→Docker was a migration you led.
     No invented metrics. -->

<div class="case-meta">
  <div><span class="k">Scale</span> 1,000+ sites · 50+ repositories</div>
  <div><span class="k">Stack</span> Drupal, Vue, Vagrant → Docker</div>
  <div><span class="k">Focus</span> CI and developer environment</div>
</div>

## The situation

A university web platform is a federation, not a product. Every department
wants something slightly different, all of it runs on shared code, and a
change that helps one college can quietly break forty others.

With fifty-plus repositories and a distributed team, the failure mode was not
bad code. It was that nobody could establish whether a thing was actually
broken. Every investigation started by ruling out the developer's own machine.

## What I did

- Built a Vue UI that deployed to more than 1,000 sites — shared interface, wildly varied local configuration.
- Set up continuous integration across 50+ repositories, so "is this broken" had an answer that was not a person's laptop.
- Standardized local development, first on Vagrant and later Docker, so the environment stopped being a variable.

## What I took from it

This is the least glamorous work I have done and probably the
highest-leverage. Nobody puts "everyone can now reproduce a bug" on a roadmap.
But every feature after it shipped faster, and the team stopped spending half
of standup on forensics.

It is also where I started thinking seriously about the difference between a
system that works and a system a team can reason about — which is most of what
I have written since.

<div class="next-prev">
  <a href="{{HOME}}problems.html#floor">← A team that cannot reproduce its own bugs</a>
  <a href="{{HOME}}cases/va-publishing.html">First case study →</a>
</div>
