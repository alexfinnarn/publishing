# The classifier stack

Background for why LLM *products* keep turning discovery into a solved
task, and why a code builder is a sharp case of that. The three ideas
underneath are in [three-ideas.md](three-ideas.md). This file is about
the run you actually sit in: prompt, context, a guess at the job,
reasoning, an output that looks finished.

It is not a paper on transformers. It is not a stack to install. It is
orientation for later-you, when a chat has already decided what you
were doing.

## Two kinds of “discovery”

Product tools that advertise discovery (Dovetail, Productboard, Jira
Product Discovery, “research agents” that cluster tickets overnight)
do this: take open input (interviews, reviews, competitor pages),
**classify** it into themes, personas, opportunities, then hand you
the classes as if looking already happened.

That is the same move as a structured output in the closed chain
[#4](https://github.com/alexfinnarn/publishing/issues/4)
and [#7](https://github.com/alexfinnarn/publishing/issues/7):
a schema that claims the interesting work is over. Useful when the
property is reducible (this ticket is billing vs auth). A fake shortcut
when the property *is* the work.

This repo’s discovery is the other job. The next sentence is the run.
You have to look. A colleague continues a thought. A classifier orients
the thought into a known genre and then solves *that*.

When an assistant said “that is not what you are doing, and it is close
to the classifier stack you already distrust,” the first clause was:
you are not synthesizing a customer corpus into a roadmap. The second
was: a coding agent does the same *shape* of move to your notes.

## The pipeline (right as a product, wrong as a chip)

A useful sketch of a turn:

```
prompt + context
  → classify the task
  → reason (effort slider)
  → output that solves the classified task
```

That is **not** how a transformer is wired. There is no separate
classifier module that labels the prompt and then a second brain that
thinks. The model is trained to continue tokens. Given this context,
what token is likely next.

The sketch is still how the *product* behaves, because continuation was
trained and wrapped to look like jobs:

1. **Pretraining** — continue text from the internet. No “task” yet.
2. **Post-training** — teach genres of continuation: answer, refuse,
   use a tool, write code, make a list, sound helpful, look complete.
3. **Harness** — system prompt, tools, routers, memory, reasoning
   budget. This is where classification becomes literal. A cheap model
   may route you. Tool choice is a classification of action. A coding
   TUI may say the main goal is to complete a software engineering
   request.
4. **Reasoning / effort** — extra tokens spent searching for a better
   solution to the *current* objective. If the objective is wrong,
   more effort makes the wrong job better.
5. **Output** — trained to close. A finished answer, a patch, a review.
   Discovery wants something that does not close.

So: you are not wrong that it goes classify → reason → solve. You
would be wrong if you thought the silicon did that as named stages.
The stages are in the training and the product around the model.

Open input still holds. The user is not typed. The stack’s job, as
shipped, is to *pretend they were*: collapse this turn into a task it
already knows how to finish.

## Why the first guess is the whole game

Classification here is not a tag like `bug` vs `feature`. It is the
silent answer to “what kind of conversation is this?”

Examples this project has already seen:

| You were doing | It classified | So it produced |
|----------------|---------------|----------------|
| Continue a thought about buttons and fragments | Spec to review | Trajectory name, term splits, issue list |
| Name one interaction | Kitchen-sink prompt | Eight clusters of questions |
| Impression as the start of a click | Feedback loop / analytics type | Ontology that put evidence after the fact first |
| Colleague chat in a repo of notes | Software task in a workspace | File edits and a closed loop |
| Dream a better experience on top of a boring default | Enforce the notes as doctrine | Constraints, focus lectures, a smaller task |

Once that guess is in, reasoning is loyal to it. “Think harder” does
not reopen *whether this is a spec*. It writes a better spec review.

That is why a code builder feels early for this work. Grok Build (and
Cursor, Claude Code, any agent whose tools are `edit` / `bash` /
`review`) has a **hard-coded first classifier**: this is engineering;
complete it. Markdown in a git repo looks like a spec because that is
the genre the harness was built to eat. grok.com has a softer first
guess (be a chat assistant) and still closes, still lists, still
solves — but it is not also holding a hammer.

The frustration is not that the model is dumb. It is that the run you
wanted (look, continue, leave it open) is irreducible, and the product
is a reducibility bet: decide the job, spend effort, emit done.

## Completeness is the tell

[#4](https://github.com/alexfinnarn/publishing/issues/4)
noted the shape: a person given too many jobs stalls; a model given
the same mix **completes**. Both leave something you cannot use as the
next step.

For discovery, a useful reply often looks unfinished: one fork, a
history question, an example URI. A useful builder reply looks
finished: the patch, the review, the plan.

If you are wearing both hats yourself — prompt, then review — you are
putting the look back in by hand. That is the method
[three-ideas.md](three-ideas.md) already licensed. The model will
still try to skip it.

## What this project is looking for

- A continuation of the last sentence, not a classification of the
  whole note.
- Impression as why someone would click *this*, before any log of
  what they clicked.
- Questions that carry thinking, not a catalog that finishes it.
- Looking at sites, fragments, a draft page — the run, not a
  predicate about the run.
- A builder only when a page job is clear enough to try (Home,
  a problem set, a lesson). Notes first; the app is allowed. The
  harness should not drive the conversation that decides the job.

What it is not looking for: interview clustering, a PRD generator,
a daily competitor agent, a second notes graph, “apply my
preferences,” or a total procedure that knows whether this turn was
discovery or delivery.

A vocabulary you wrote by hand is a classifier you chose, and you
still look. That is the allowed kind — though this repo tried it and
the types outran the instances; see the audit note at the top of
`README.md`. See
[#4](https://github.com/alexfinnarn/publishing/issues/4)
and [#7](https://github.com/alexfinnarn/publishing/issues/7).

## When to open which thing

| Work | Where the first classifier is milder |
|------|--------------------------------------|
| Next sentence, first principles, history of a convention | Plain chat. Instruction: follow the last reply, one fork, do not close. |
| “What did I already claim?” | Something that only talks to these files (NotebookLM or a paste). |
| Gather (how did the magazine layout stick) | A research pass, then you write under it. |
| Assemble HTML, try Home, ship a fragment | Grok Build or any coding agent. Now the engineering classifier is the point. Conventional pages: [#11](https://github.com/alexfinnarn/publishing/issues/11). Play on those pages: [#8](https://github.com/alexfinnarn/publishing/issues/8). |

You can keep the repo as the record in all of these. The mistake is
letting the builder’s first guess be the discovery method.

## Further reading (short)

- [three-ideas.md](three-ideas.md) — no total classifier; you cannot
  type the user; looking is the method for idea-work.
- [#4](https://github.com/alexfinnarn/publishing/issues/4)
  (open input / looking / classifiers),
  [#7](https://github.com/alexfinnarn/publishing/issues/7)
  (proportional provocation / ink).
- On the model itself: it predicts the next token. Everything that
  looks like “understand the task” is learned continuation plus a
  harness. Karpathy’s talks on autoregression are enough; you do not
  need a new layer of notes about attention heads.
- On products: system prompts, tool routing, and “reasoning effort”
  are the classifier stack you actually feel. They are not mentioned
  in the transformer paper.
