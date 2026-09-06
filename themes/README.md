# Themes as communication policies

Start here to apply a theme independently of a website, framework, or output
format. These documents preserve the current working definition and provide
two policies ready for a first experiment. They are provisional, not settled
architecture; user direction takes precedence.

**A theme is a reusable communication policy that determines how structured
material becomes a reading experience.** The theme owns composition,
expression, and presentation. The author supplies material and intent, not a
page layout or a selection of presentation components.

## The concepts

| Concept | Responsibility |
| --- | --- |
| Material | Facts, passages, evidence, media, and meaningful relationships |
| Communication brief | Audience, purpose, and what the reader needs to understand or accomplish |
| Theme | Rules for interpreting, selecting, composing, expressing, and presenting material |
| Publication | The resolved reading experience produced by applying those rules |

“These steps must happen in order” is a relationship in the material, not an
author's layout instruction. A theme preserves that relationship while
choosing how to communicate it. A theme may introduce an explanatory order,
but it must not invent factual priority, causal relationships, or importance.

Each policy addresses interpretation, composition, expression, presentation,
and boundaries/evaluation. Numeric tokens may eventually implement some
presentation decisions; they do not define the theme by themselves.

## Run the first experiment

You only need to provide **one small body of material**. Use the optional
[material template](MATERIAL.template.md), paste notes, or name source files.
You do not need to choose leads, sections, layouts, or policy rules.

Then follow [the application process](PROCESS.md), applying both supplied
policies to exactly the same material and communication brief:

- [Broadsheet v0.1](policies/broadsheet.md): finding, consequence, evidence, background.
- [Field Guide v0.1](policies/field-guide.md): situation, recognition cues, supported actions, limitations.

These are starting policies defined for the experiment, not requests for the
author to fill in policy templates. If the material cannot support part of a
policy, the process explains how to record that rather than fabricate content.

## What applying a theme produces

```text
Inputs:  material + communication brief + theme policy
Outputs: publication + decision record + unresolved questions
```

The publication is for the reader. The decision record explains choices and
source support to the author or reviewer; it is not inserted into the reader's
experience. Unresolved questions make limits explicit without filling gaps.

An agent or person can apply these policies. Language generation involves
judgment: applying a prose policy twice need not yield identical wording.
Save the inputs, policy version, and resolved output for review and reuse.
Rendering a saved publication is a separate concern.

## Relationship to the existing site

The [site tutorial](../site/THEME-TUTORIAL.md) describes the existing runtime's
theme mechanics. It is not the definition of a theme. Its fixed-content test
matrix is useful for checking presentation, but does not yet apply the
language and composition policies here.

This abstract Broadsheet policy is informed by the newspaper reference. It is
not a claim that the current site implements these rules. Likewise Field Guide
is a policy, not an installed site theme. No framework adapter is needed for
the first experiment: readable text and a description of intended hierarchy
are sufficient to inspect the decisions.
