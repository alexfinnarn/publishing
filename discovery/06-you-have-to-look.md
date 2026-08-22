---
title: You have to look
created: 2026-08-18
updated: 2026-08-19
---

You reached for the [halting problem](04-input-problem.md) because an
agent can get anything, and typed code cannot. The background for that
instinct is in [references/three-ideas.md](../references/three-ideas.md):
halting (no total classifier), open input (you cannot type the user),
and irreducibility (for taste and idea-work, you run it and look).

The stack people keep adding — tiny eval prompts, MCP around ordinary
APIs, graph DBs for a folder of notes, quality gates that "apply your
preferences" — is a bet that the next layer already classified the
interesting part. You said you do not trust that bet. You need to see
the output to choose the next step.

Now add **structured outputs**: a schema on the model's reply so the
JSON is typed, valid, and can be fed into the next call as if it were
an API. Same move as a tool schema, on the *way out* instead of the
way in.

Tomorrow, write into this:

**When you pipe a structured output into the next model call, what did
the schema decide for you — and what can you no longer see?**

Not the industry. One pipeline you have used or almost built. What was
typed. What the next call was allowed to assume. What a paragraph would
have shown you that the object hid. Was the schema a reducible edge
(datetime, id, enum) or a lock on the idea?

Write under the question. Ignore the prompt if a better sentence shows
up.

---

I've often wondered about structured outputs but have never used them so my answers 
are not as reasoned. But I can think through what would happen.

Say we have a discovery process just like this where several company files are 
ingested and we need to make a structured output. 

First question: Can we make the output schema correct enough for the input since it is 
not structured? 

So, right from the get-go the first input can become an issue leading to needing to 
review the second input, which is the structured output from the first run. 

Asking "what can you no longer see?" is a good question since it could be a lot. So, a 
discovery process for a project is a terrible idea to use for structured outputs, I 
think. 

I have seen structured output useful as far as "classifiers" go and providing context 
to a reviewer. For example, any insurance claim can have an LLM run over data and 
produce a report with confidence intervals of whether fraud is detected. You could 
extend that to allow for some claims to go faster, but if bad actors pick up on this, 
then they could pattern their claims to fool the classifier. 

I believe this is called "generational adversarial training" and GAN networks do this 
producing output that is increasingly harder to detect if it is "fake". 

And furthermore, if an AI is constrained on output, then it's pattern matching is 
severely hampered so even though it might have a great side point to make no one would 
ever see it outside of reasoning traces. 

When I think of a human creating structured outputs, they always have the discretion 
to stop and work on updating the process when certain input or output gets screwed up 
but for an LLM that would need another classifier or something. And LLMs are trained 
to go to completion vs "complain when you don't think the process is right".

Continued in [Where a classifier belongs](07-where-a-classifier-belongs.md).