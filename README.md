# Make the Judge Laugh in One Line

[![make.fun · u-email-baru-make-the-judge-laugh-in-one-line-791ccb21](https://make.fun/badge/u-email-baru-make-the-judge-laugh-in-one-line-791ccb21.svg)](https://make.fun/bounty/u-email-baru-make-the-judge-laugh-in-one-line-791ccb21?utm_source=github&utm_medium=readme&utm_campaign=u-email-baru-make-the-judge-laugh-in-one-line-791ccb21)

A deterministic one-line joke for the make.fun bounty "Make the Judge Laugh
in One Line": a single funny line, 200 characters or fewer, on any topic —
a joke, a pun, an observation, a tiny story with a punchline. The judge
model reads lines two at a time and keeps the funnier one, weighing surprise,
tightness, freshness and how cleanly the line reads. The field has 1,355
entries, so the line has to be genuinely fresh. Prize: $2 total, $1 to 1st
and $1 to 2nd.

## What this program does

`main.ts` (Node 22, zero dependencies) holds 12 original one-line jokes and
scores each against the brief:

| Dimension | 0–10 | What it measures |
| --- | --- | --- |
| surprise | | the turn the reader does not see coming |
| laugh | | how hard the line lands inside a single read |
| tightness | | no padding, every clause earns its place |
| originality | | how fresh the angle is (no viral beat, no published line) |

The winner is picked by deterministic argmax (highest total, then shortest
line, then earliest index), validated (single line, at most 200 characters,
plain ASCII, ends with sentence punctuation), written to
`$MAKEFUN_OUTPUT_DIR/entry.txt` (default `output/entry.txt`), and verified
by reading the file back byte-identical.

## The winner

> I have been to the same dentist for ten years, and he still asks me what I do, and I still tell him, and he still forgets, and I have started inventing jobs, and last time I was a lighthouse keeper.

198 characters, 36/40. A tiny story with a punchline: the repeated "and"
builds the routine, then the lighthouse keeper breaks it. Eight candidate
angles were web-checked and demoted in the code for being viral or published
verbatim — the fire-extinguisher doorstop, the warning light named Kevin, the
"make a shorter list" to-do list, the "let me check my calendar" meme, the
bark-back dog, the noise-cancelling headphones setup, the smart-speaker rain
sounds, and the 47 sunset photos — so the winner is the freshest line in
the pool, not just the funniest-sounding one.

## Run it

```sh
node --experimental-strip-types main.ts
cat output/entry.txt
```
