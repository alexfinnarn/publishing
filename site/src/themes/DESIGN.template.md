# Theme: <name>

Provisional authoring worksheet, first exercised with [broadsheet](broadsheet/DESIGN.md).
This is not a build input or a new required schema. Keep sections brief; link
to shared rules instead of copying them. Record unknowns rather than inventing
answers. Existing runtime fields and tokens remain authoritative.

## Purpose
Who is reading, what are they trying to understand, and where is this theme used?

## Design reference
Name a concrete reference, what to borrow, and the few recognizable features.

## Language
Describe relevant writing conventions with an example and counterexample.
Distinguish canonical page copy from theme-owned chrome. These instructions
apply when authoring or explicitly revising copy; rendering preserves wording.

## Visual decisions
Explain the roles and relationships of color, typography, spacing, and rules.
Link to authoritative CSS tokens. Identify any proposed new values separately.

## Components and layout
Name existing primitives and choices. Distinguish observed behavior from
intended behavior. Explain proposed overrides and the meaning to preserve.

## Responsive behavior
Describe what wraps or changes as available space shrinks, and what remains
usable. Declare color schemes and motion behavior by reference to theme.json.

## Boundaries
Reference the shared contract in the site README and src/lib/themes.ts.
Resolve links from the actual theme directory. Name permitted changes and
unresolved semantic questions; do not silently turn them into requirements.

## Acceptance examples
Name representative content, widths, and interaction states. Distinguish
automated assertions from visual or editorial review. Define one bounded
extension before implementing it.

## Open questions
What needs experimentation? Link to the exercise record for observations,
verification results, and decisions revised after implementation.
