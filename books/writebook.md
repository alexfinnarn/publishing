# Writebook (notes, not code)

[Writebook](https://github.com/basecamp/writebook) is self-hosted software for
publishing web books (cover, chapters, picture pages, private → public). One
install is a **library** of many books on one domain.

It is a renderer you log into on a server. It is not this working directory.

## What that implies

- Draft here in markdown. Paste into Writebook when a book is worth publishing
  as a book.
- Do not vendor or fork the app inside `publishing/`.
- A clone already exists at `~/Sites/personal/writebook` (upstream / local
  look). Treat it as reference, not as the manuscript repo.
- No formal import/export; no PDF/ePub. Web-only. Updates ping 37signals unless
  turned off.
- Hosting (Docker / ONCE, domain, SSL) is an ops decision *after* there is a
  manuscript. Not part of getting the ontology right.

## When to care

Use Writebook when a stranger should *read a book* and the Site’s essay format
is the wrong shape. Until then, an outline in this folder is the whole stack.
