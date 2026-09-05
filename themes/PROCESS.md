# Apply and compare the policies

This procedure is for a human or agent. Read the [concepts](README.md) and
both policy files before starting. The author supplies the material; the
applicator makes and records the communication decisions.

## 1. Freeze the inputs

Save the supplied material or an exact excerpt, retaining source names and
locations. If files may change, save a snapshot or record their revision.
Use only the supplied material for the first experiment. Do not silently
research, embellish, or borrow facts from policy examples.

Use the supplied audience and purpose. If absent, record these defaults:

- Audience: a reader unfamiliar with this particular material; do not assume
  specialist background beyond what the material explains.
- Purpose: understand the subject, its significance, and its limits.
- Length: no fixed word count; use enough space for supported meaning without
  repetition. Do not force equal lengths across the two publications.

Apply the same brief to both policies. A policy may emphasize a different
reading path, but may not quietly substitute a different audience or purpose.

## 2. Make a shared source ledger

Assign stable identifiers to source passages or meaningful units: M1, M2, etc.
For each, record the source location, what it says, whether it is a supplied
claim or supported observation, and qualifications/relationships to preserve.
This is work for the applicator, not a form the author must complete.

Do not turn every sentence into an isolated fact if doing so loses context.
Distinguish a quoted claim from an independently established fact. Preserve
dates, attribution, required order, and uncertainty.

## 3. Apply each theme independently

Read the original ledger and one policy. Resolve its interpretation,
composition, expression, and presentation rules, in that order. Then repeat
with the other policy using the same ledger, not the first publication as
input. This prevents the second result from inheriting the first theme's
editorial choices.

Write an actual reader-facing publication, not just a plan for one. Markdown
is a convenient inspection format, not a required target. Alongside it,
describe presentation decisions that text cannot demonstrate: relative
emphasis, grouping, density, and behavior as available space changes.

When a policy asks for an unsupported element, follow its fallback. Proceed
with a partial result when it remains useful. If no usable material was
provided, report that missing input instead of manufacturing a publication.
No generic request to “define the policy” should be sent back to the author.

## 4. Keep a decision record for each result

Record the policy name/version and use a compact table:

| Decision | Policy rule | Supporting material | Transformation or limit |
| --- | --- | --- | --- |
| What became the opening | Rule identifier | Material IDs | Why it fits, including uncertainty |
| How material was grouped | Rule identifier | Material IDs | Grouping, order, or synthesis |
| What was shortened or omitted | Rule identifier | Material IDs | Reason and effect on meaning |

Every substantive assertion in the publication must be traceable to the
ledger, either individually or as part of an explicitly mapped paragraph.
Label inference as inference. Explanatory transitions need not have their own
source, but must not smuggle in claims. Record important omissions even if
the publication reads smoothly without them.

Keep a separate list of unresolved questions. Mark whether each comes from
missing material, ambiguity in a policy, or a choice needing author review.

## 5. Evaluate and compare

Review both publications against these shared checks:

- Facts, attribution, qualifications, and required relationships survive.
- The theme made the composition decisions without asking the author to lay
  out the page or choose presentation components.
- Rewording does not strengthen a claim or imply unsupported causation.
- The result serves the shared brief and can be understood on its own.
- Missing support is disclosed; decorative completeness did not drive invention.
- Each policy's own acceptance checks are answered with examples from the result.

Then compare the opening, grouping/order, language, omissions, and intended
presentation. Explain each important difference by referring to policy rules.
Two indistinguishable outputs may mean the policies lack useful distinctions;
differences unsupported by a policy expose undocumented judgment.

Do not select a winner merely because one looks more polished. Explain the
tradeoff and whether the input was a good fit for each policy. If a policy
could not produce a supported section, report a partial application rather
than pretending both succeeded equally.

## 6. Save the experiment and refine one thing

For a repository-based run, a suggested folder is `themes/experiments/<name>/`:

```text
material.md                  supplied input or snapshot
brief-and-ledger.md           shared defaults/context and source mapping
broadsheet.md                 first publication
broadsheet-decisions.md       decisions, presentation intent, and open questions
field-guide.md                second publication
field-guide-decisions.md      decisions, presentation intent, and open questions
comparison.md                evidence, tradeoffs, and next experiment
```

This is an output convention, not a new mandatory API. Preserve a copy of
each applied policy or a repository revision that identifies it. Suggest
policy changes after the comparison; do not rewrite a policy midway and then
claim the original policy produced the revised result. Test a revision in a
new pass, keeping the old evidence.

## A prompt that needs no chat history

> Read themes/README.md, themes/PROCESS.md, and both files in themes/policies/.
> Apply Broadsheet v0.1 and Field Guide v0.1 independently to the material I
> provide. Use the documented defaults for omitted context. Produce both
> publications, source-linked decision records, unresolved questions, and a
> comparison. I supply material, not composition or theme rules. Do not add
> unsupported facts or implement a website. Record proposed policy revisions
> separately from the policies actually applied.
