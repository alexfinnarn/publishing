# Halting, open input, and irreducibility

Background for the closed chain in
[#4](https://github.com/alexfinnarn/publishing/issues/4)
(open input, looking, classifiers, request size).

These are three different results. They rhyme. They do not prove each
other. The discovery notes borrow their *shape*. They do not apply the
proofs to a language model as if ChatGPT were a Turing machine you feed
as source.

## 1. The halting problem

**Alan Turing, 1936**, in "On Computable Numbers, with an Application to
the Entscheidungsproblem."

Claim: there is no general algorithm that, given *any* program `P` and
*any* input `x`, always answers correctly whether `P` halts on `x` or
runs forever.

The proof is a diagonal argument. Suppose a decider `H(P, x)` existed
and always returned yes or no. Build a program `D` that asks `H` about
*itself* and does the opposite: if `H` says `D` will halt, `D` loops; if
`H` says `D` loops, `D` stops. Contradiction. So `H` cannot exist.

What it does **not** say:

- That you cannot tell whether *this* loop finishes. Many specific
  programs are trivial to decide.
- That computers "get stuck" in some mystical sense.
- That AI outputs are unpredictable, or that tools are impossible.

What it licenses in the notes: you cannot have a **total** procedure
that classifies every possible natural-language request the way a type
checker classifies every well-typed AST. "Will this agent finish a
useful job on this brief?" is undecidable in the same *spirit* once the
input is unbounded English plus tools plus the open web. It is not the
theorem itself.

A closer cousin in computability is **Rice's theorem**: any nontrivial
semantic property of programs is undecidable. "Does this agent do what I
meant?" is a semantic property.

In practice we already live with this. Timeouts, sandboxes, type systems
for *fragments* of computation, human checkpoints. We do not wait for a
universal decider.

Primary source: Turing, A. M. (1936). On computable numbers, with an
application to the Entscheidungsproblem. *Proceedings of the London
Mathematical Society*.

## 2. Open input

This one is not a named theorem. It is the engineering fact the other
two make expensive.

Deterministic software takes **classified** input: a schema, a type, a
validated form, a finite set of events. The next layer is allowed to
assume the last layer narrowed the world.

A chat agent takes **open** input. Anything that can be pasted. One
word, a paragraph, a repo, a preference, a contradiction, last week's
plan. There is no constructor that rejects "wrong" work the way
`int` rejects a string.

Consequences:

- **Distribution shift.** Products and evals overfit to short, clean
  prompts because they are cheap to write and score. Real work is long,
  contextual, and iterative. A tool designed around "students type one
  noun" breaks when someone types a brief.
- **Tools as false closure.** JSON tool schemas re-introduce types at
  the edge. That is useful for side effects you must audit (money,
  calendar, git). It is a crutch when the tool only exists because the
  author imagined a skinny turn shape.
- **MCP.** Model Context Protocol is a way for a *host* to discover,
  permission, and render tools. The valuable calls are still APIs.
  MCP matters for "Add connector" UIs in superapps. It is not a new
  computational layer. A person with docs and `curl` does not need it
  to do the work.
- **Composable surface shrinks.** You can share a REST handler. You
  cannot share "whatever people type" unless you collapse it back into
  something typed. Open input is more natural and less composable.
  Teams fake composability with short evals, which trains the product
  toward unnatural use.

Related vocabulary, none of it a proof: open-world vs closed-world
assumption; out-of-distribution inputs; the frame problem in AI (you
cannot enumerate every relevant fact in advance).

The practical claim: **you cannot type the user.** Layers that assume
you did — rigid tools, preference injectors, memory graphs for a folder
of notes — rot as people get more fluent.

## 3. Computational irreducibility

**Stephen Wolfram**, developed across the 1980s–2000s, stated at length
in *A New Kind of Science* (2002), especially the discussion of systems
whose future states have no shortcut.

Claim: for many computations, the shortest way to know the outcome is to
**run the computation**. There is no closed-form jump to the final
state that is cheaper than the trajectory itself.

This is not undecidability. The system can be fully determined, even
simple (elementary cellular automata). You still cannot skip the steps
if you want the actual state.

What it licenses in the notes: for taste, voice, and idea-work, **looking
at the run is the method**. A quality gate is a reducibility bet: a
predicate that stands in for having read the draft. That works when the
property is reducible (valid JSON, tests green, a real datetime). It
fails when the property *is* the work (is this the thought, did this
cut earn the next structure, does this sound like me *here*).

Preferences sit in the irreducible pile. They are not a schema you
inject once. They appear as reactions to a specific artifact. An agent
that "applies your preferences" in advance is claiming a shortcut
through a path you still need to walk. Abstractions are the same
shortcut: they lock the class of work before the surprising
intermediate has a chance to change the design.

What it does **not** license: never write a test; never type an API;
never automate. Automate the reducible edges. Do not automate the look.

Wolfram's own framing is physical and computational (nature as programs,
no shortcut to the weather). The notes use only the methodological
piece: when you cannot compress the trajectory, the next step is a
function of the current output.

Primary source: Wolfram, S. (2002). *A New Kind of Science*. Also
earlier papers on cellular automata and the "computational
irreducibility" phrase in his writing from the 1980s.

## How they sit together

| Idea | What it is | What it licenses here | What it does not license |
|------|------------|------------------------|---------------------------|
| Halting | No total decider for "does `P` halt on `x`?" | You cannot pre-classify every input / every "did the agent finish well?" | Tools are impossible; AI is mystical |
| Open input | Chat has no schema; people do not stay in the eval dialect | You cannot type the user; layers that assume you did will rot | Delete every tool; never use an API |
| Irreducibility | For many systems, prediction is not cheaper than simulation | For taste and idea-work, looking at the run is the method | Never write a test; never gate a side effect |

Halting is about **impossibility of a total classifier**.
Open input is about **the actual input space of agents**.
Irreducibility is about **why the working loop is run → look → step**.

The false move they all push against is the same: add a layer that
claims to have already walked the path.

## What is reducible anyway

Keep these small and typed:

- Side-effecting APIs (calendar, payments, git, anything you audit)
- Host permission and allowlists (this is the honest job of MCP)
- Format and invariant checks (schema, tests, lint)
- Timeouts and budgets so an agent cannot wander forever

Do not pretend these replace reading the page.

## Further reading (short)

- Turing 1936, as above. Any computability textbook (Sipser; Cutland)
  for a modern writeup of halting and Rice.
- Wolfram, *A New Kind of Science*, ch. on computational irreducibility.
  For a shorter path: his notes collected at stephenwolfram.com on the
  phrase.
- For open-world vs tools: OpenAPI as the description that already
  existed; MCP spec as a host integration format, not a new semantics.
- For "the web is already a graph": pages as nodes, links as edges. A
  graph database earns its keep at multi-writer, multi-hop, product-scale
  relationship load — not a personal folder of markdown.
- How that feels in a chat or a coding agent:
  [classifier-stack.md](classifier-stack.md).
