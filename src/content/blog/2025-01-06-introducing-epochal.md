---
title: Epochal - Date Parsing for Historians
meta: I'd like to introduce Epochal, a novel natural language date library handling for ambiguous historical dates.
tags: blog
date: 2025-01-06
slug: introducing-epochal
teaser: |
    Ever wanted to work with those ambiguous date ranges you see in museum exhibits? Whether it's plotting the timeline of Vermeer’s masterpieces or untangling the chaotic revolutions of 18th-century Europe, I’ve got a solution for you—or maybe just for me! Meet Epochal, a novel date library for Typescript that brings natural language date parsing to a whole new level.
---

This might just be a Kevin problem, but do you ever want to work with the kind
of dates that get printed next to artifacts in your nearest big-city museum?
Perhaps you're plotting a timeline of all 32 Vermeer paintings, or tracking the
overlapping governments and revolutions of 18th and 19th-century Europe...

Yeah, this is probably a Kevin problem. But now it has a Kevin solution!

I officially released this about a year ago, but I'm going to formally introduce
[Epochal](https://github.com/kjrocker/epochal), a novel date library for
Typescript.

Here's how it works:

```ts
import { epochize } from "epochal";

const [start, end] = epochize("4th millenium BC");

console.log(start);
// January 1st, 4000 BC

console.log(end);
// December 31st, 3001 BC
```

That's all there is to it! No extensive option list (yet), just a
straightforward string-to-interval conversion function doing a non-trivial task.

It supports many unusual formats you won't see in a normal date library:

- 12th century BC
- early 17th century
- 1999
- June 2020
- July 18th, 2027
- late July 1920
- mid 1888

It's actually a bit too simple to do a whole in-depth introduction. I'll write
some articles on the internals later, but I kinda want to share how this
happened.

Epochal was carved out of a much larger project. I wanted to built a whole app
around this logic that would let people make custom visualizations of different
timelines. There are lots of tools for making _charts_, but dynamic, data-driven
timelines are much rarer. They're harder than bar charts.

However, between work and the sense that the audience for this was likely just
five people and a museum, the whole project withered. But then I was left with a
really cool natural language interval parser.

So I decided that while I couldn't really maintain and develop a whole
_application_ in my spare time, a well-tested open source utility library was
much simpler, and would give the satisfaction of finishing and then _iterating_
on something complicated and novel.

So now, instead of shipping a half-assed timeline builder, I can put all my
energy into a parser that I can be proud of.

The internals have been fun to explore, allowing me to focus on the details.
This has produced some interesting results:

1. There are a lot more regular expressions than you'd expect.
2. There are over 20,000 randomly generated tests.
3. It uses a monad as the core of its control-flow logic.
4. I'm already rewriting it in Rust (Kinda. Not really, but also yes really.)

That’s Epochal for now! I’m hoping to keep improving it when inspiration
strikes—or when someone out there comes up with an even cooler use case than I
could've imagined.
