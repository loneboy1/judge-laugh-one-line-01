// Judge Laugh One Line — deterministic one-liner writer.
// make.fun competition: u-email-baru-make-the-judge-laugh-in-one-line-791ccb21
//
// A deterministic TypeScript program (Node 22, zero dependencies) that
// scores original one-line jokes, picks the winner by deterministic argmax,
// and writes it to output/entry.txt.
//
// Judge's brief (from the competition page):
//   - a single funny line, 200 characters or fewer, on ANY topic: a joke,
//     a pun, an observation, a tiny story with a punchline
//   - the judge model reads lines two at a time and asks which is funnier,
//     weighing surprise, tightness, freshness and how cleanly the line reads
//   - 1,355 entries in the field, so the line must be genuinely fresh
//
// Scoring rubric (each 0-10, editorial judgement recorded in the data):
//   surprise    - the turn the reader does not see coming
//   laugh       - how hard the line lands inside a single read
//   tightness   - no padding, every clause earns its place
//   originality - how fresh the angle is (no viral beat, no published line)
//   total       = surprise + laugh + tightness + originality (max 40)
// Hard gates: single line, <= 200 chars, ends with sentence punctuation,
// plain ASCII. Tie-break: higher total, then shorter line, then earlier index.
// The winner is therefore fully determined by the data + the rubric.
//
// ORIGINALITY (web-checked 26 Nov 2026; demoted candidates stay in the pool
// with their scores cut, so the record shows the work):
//   - fire extinguisher as a doorstop: the gag is live and viral (Threads
//     "tahan pintu" post 25 Nov; "NOT A Door Stopper" cartoon Apr 2026).
//   - warning light named Kevin: an Instagram Reel posted 25 Nov tells
//     this exact story (light as a houseplant, named Kevin, friend panics).
//   - to-do list "make a shorter list": published VERBATIM as a one-liner
//     (stickmanstorymaker.com, "My to-do list got so long that I added
//     'make a shorter list' to it").
//   - "let me check my calendar": a viral adulting meme (Facebook official
//     post, "I SAY 'LET ME CHECK MY CALENDAR' WHEN I ALREADY KNOW THE
//     ANSWER IS NO").
//   - barking back at the neighbour's dog: "Do you want me to bark back?"
//     is a viral Nov 2025 Reel gag; "I MUST BARK BACK" is a published cartoon.
//   - noise-cancelling headphones "so I can hear myself think": the setup
//     phrase is published verbatim (Lemmy thread).
//   - smart-speaker rain sounds: "Siri, play rain sounds" with real rain
//     is a published Reel; the leak turn is mine but the setup is hot.
//   - mother sending the same sunset photo 47 times: "47 PICTURES OF THE
//     SAME SUNSET" is a full-blown meme (multiple posts, same number).
// The winner (dentist who forgets my job; last time I was a lighthouse
// keeper) returned no match: dentist jokes online are all tooth puns
// ("tooth-hurty", "Netflix and drill"), and "lighthouse keeper" appears
// only in an unrelated "careers I've considered" meme list.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface Candidate {
  line: string;
  surprise: number; // 0-10: the turn the reader does not see coming
  laugh: number; // 0-10: how hard the line lands inside a single read
  tightness: number; // 0-10: no padding, every clause earns its place
  originality: number; // 0-10: fresh angle, no viral beat or published line
  why: string;
}

const CANDIDATES: Candidate[] = [
  {
    line: "I have been to the same dentist for ten years, and he still asks me what I do, and I still tell him, and he still forgets, and I have started inventing jobs, and last time I was a lighthouse keeper.",
    surprise: 9, laugh: 9, tightness: 9, originality: 9,
    why: "WINNER: a tiny story with a punchline, exactly the brief. The repeated 'and' builds the routine, then the lighthouse keeper breaks it. No match online for the dentist-forgets-my-job setup.",
  },
  {
    line: "My lawyer charges by the hour, and he once charged me for a text that said 'ok', which is the most expensive 'ok' in history, and I still owe him for the 'thanks'.",
    surprise: 8, laugh: 8, tightness: 7, originality: 7,
    why: "Also-ran: the 'ok' billing turn is specific, but lawyer-billing jokes are a crowded trope and the line runs long.",
  },
  {
    line: "I set my alarm for 6am, woke up at 5:58, and lay there furious at my body for being early to a job it hates.",
    surprise: 7, laugh: 7, tightness: 9, originality: 7,
    why: "Also-ran: tight and true, but waking up just before the alarm is a well-worn relatable beat.",
  },
  {
    line: "The queue at the post office moves at exactly the speed of one person realising they brought the wrong form.",
    surprise: 7, laugh: 7, tightness: 8, originality: 7,
    why: "Also-ran: a clean observation, but it smiles rather than lands a punchline.",
  },
  {
    line: "I asked my smart speaker to play the sound of rain to help me sleep, and it did, which is great, except my roof leaks, so now the rain is in surround sound.",
    surprise: 8, laugh: 8, tightness: 7, originality: 5,
    why: "DEMOTED: the leak turn is mine, but 'play rain sounds' smart-speaker jokes are actively viral (Nov 2026 Reels); the setup is hot.",
  },
  {
    line: "I have waited eleven years in this hallway to be a hero, and the closest I have ever come is being used as a doorstop.",
    surprise: 7, laugh: 8, tightness: 8, originality: 4,
    why: "DEMOTED: extinguisher-as-doorstop is a live viral gag (Threads 'tahan pintu' 25 Nov; 'NOT A Door Stopper' cartoon); the framing is mine but the beat is not.",
  },
  {
    line: "I bought noise-cancelling headphones so I could hear myself think, and the first thing I thought was that I should return them.",
    surprise: 7, laugh: 8, tightness: 8, originality: 4,
    why: "DEMOTED: the setup phrase 'I wear noise cancelling headphones so I can hear myself think' is published verbatim (Lemmy); only the return turn is mine.",
  },
  {
    line: "My neighbour's dog barks at me every morning, and I have started barking back, not because it helps, but because at this point it is the only conversation I have before coffee.",
    surprise: 7, laugh: 7, tightness: 7, originality: 4,
    why: "DEMOTED: 'Do you want me to bark back?' is a viral Nov 2025 Reel gag and 'I MUST BARK BACK' is a published cartoon; the coffee turn does not save the beat.",
  },
  {
    line: "My car's warning light has been on so long that I have named it Kevin, and Kevin and I have an understanding now: he stays lit, and I stay calm.",
    surprise: 7, laugh: 8, tightness: 7, originality: 3,
    why: "DEMOTED: an Instagram Reel posted 25 Nov tells this exact story (warning light as a houseplant, named Kevin, friend panics). Near-duplicate; do not use.",
  },
  {
    line: "My to-do list got so long that I added 'make a shorter list' to it, and now the list is longer, and I am shorter on time, and the list knows it.",
    surprise: 7, laugh: 8, tightness: 6, originality: 2,
    why: "DEMOTED: the core line is published VERBATIM as a one-liner ('My to-do list got so long that I added \"make a shorter list\" to it').",
  },
  {
    line: "I say 'let me check my calendar' when I mean 'let me check if I want to', and my calendar is empty, so I am just standing there, checking nothing, for effect.",
    surprise: 6, laugh: 7, tightness: 7, originality: 3,
    why: "DEMOTED: 'let me check my calendar' as a stall is a viral adulting meme (Facebook official post, 23K likes, 'I ALREADY KNOW THE ANSWER IS NO').",
  },
  {
    line: "My mother has sent me the same photo of a sunset 47 times, one at a time, over three days, like a slow-motion postcard from a holiday she is not on.",
    surprise: 6, laugh: 7, tightness: 7, originality: 3,
    why: "DEMOTED: '47 PICTURES OF THE SAME SUNSET' is a full-blown meme (multiple posts, same number 47); the postcard turn does not save it.",
  },
];

const MAX_CHARS = 200;

function total(c: Candidate): number {
  return c.surprise + c.laugh + c.tightness + c.originality;
}

function validate(c: Candidate): string[] {
  const problems: string[] = [];
  if (c.line.includes("\n")) problems.push("multi-line");
  if (c.line.length > MAX_CHARS) problems.push(`too long (${c.line.length} chars)`);
  if (!/[.!?]$/.test(c.line)) problems.push("no closing punctuation");
  if (/\s{2,}/.test(c.line)) problems.push("double space");
  for (let i = 0; i < c.line.length; i++) {
    if (c.line.charCodeAt(i) > 127) { problems.push("non-ASCII"); break; }
  }
  if (c.surprise < 0 || c.surprise > 10 || c.laugh < 0 || c.laugh > 10 ||
      c.tightness < 0 || c.tightness > 10 || c.originality < 0 || c.originality > 10) {
    problems.push("score out of range");
  }
  return problems;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });

  const scored = CANDIDATES.map((c, i) => ({ ...c, index: i, total: total(c), problems: validate(c) }));
  const rejected = scored.filter((s) => s.problems.length > 0);
  if (rejected.length > 0) {
    for (const r of rejected) console.error(`REJECTED #${r.index}: ${r.problems.join(", ")}`);
    throw new Error(`${rejected.length} candidate(s) failed validation`);
  }

  // Deterministic argmax: highest total, then shortest line, then earliest index.
  const ranked = [...scored].sort(
    (a, b) => b.total - a.total || a.line.length - b.line.length || a.index - b.index,
  );
  console.log("rank  total  surpr laugh tight orig chars");
  for (const s of ranked) {
    console.log(
      `#${String(ranked.indexOf(s) + 1).padStart(2)}  ${String(s.total).padStart(2)}/40   ${s.surprise}      ${s.laugh}     ${s.tightness}     ${s.originality}    ${String(s.line.length).padStart(3)}`,
    );
  }

  const winner = ranked[0];
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, winner.line + "\n", "utf8");
  // Round-trip verification: read the file back and throw unless byte-identical.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== winner.line + "\n") {
    throw new Error(`round-trip mismatch in ${outPath}`);
  }
  console.log(`\nWINNER (${winner.total}/40, ${winner.line.length} chars):`);
  console.log(winner.line);
  console.log(`Wrote ${outPath}`);
}

main();
