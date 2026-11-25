// Tell a Whole Story in 32 Characters — make.fun entry (v2, revised).
//
// The Wi-Fi name on the router is the whole proposal. He never bought
// a ring: the password IS the ring. Whoever reads the network list
// sees the courtship, the shared flat, and the yes — all in one SSID.
//
// This program assembles the entry from its story beats, checks it
// against the competition gate, and writes it to entry.txt with no
// trailing newline. Node 22, stdlib only, no network, deterministic.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The story, told beat by beat. Concatenated with no separator, the
// beats read as one Wi-Fi network name.
const STORY_BEATS = [
  "He", // the hero
  "Proposed", // the act
  "With", // the twist begins
  "The", // the object
  "WiFi", // the modern ring
  "Password", // the promise
];

// The gate, as published in the competition kit: 1-32 UTF-8 characters,
// a single line, not only whitespace.
const GATE = Object.freeze({
  minChars: 1,
  maxChars: 32,
  expectedChars: 29,
});

function assembleEntry(beats) {
  return beats.join("");
}

function countChars(text) {
  return [...text].length;
}

function findGateProblems(text) {
  const problems = [];
  const chars = countChars(text);
  if (chars < GATE.minChars || chars > GATE.maxChars) {
    problems.push(
      `length ${chars} outside ${GATE.minChars}-${GATE.maxChars}`,
    );
  }
  if (chars !== GATE.expectedChars) {
    problems.push(
      `expected ${GATE.expectedChars} characters, got ${chars}`,
    );
  }
  // Cross-check: the entry is plain ASCII, so its UTF-8 byte length
  // must equal its character count; a mismatch means a stray
  // multi-byte character slipped into a beat.
  const bytes = new TextEncoder().encode(text).length;
  if (bytes !== chars) {
    problems.push(`byte length ${bytes} != char length ${chars}`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    problems.push("entry spans more than one line");
  }
  return problems;
}

async function writeEntry(outDir, text) {
  await mkdir(outDir, { recursive: true });
  // No trailing newline: the gate counts every byte in entry.txt.
  const target = join(outDir, "entry.txt");
  await writeFile(target, text, "utf8");
  // Read it back and confirm byte-exactness before reporting success.
  const written = await readFile(target, "utf8");
  if (written !== text) {
    throw new Error("entry.txt does not match the entry text");
  }
}

async function main() {
  const entry = assembleEntry(STORY_BEATS);
  const problems = findGateProblems(entry);
  if (problems.length > 0) {
    throw new Error(`gate failed: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  await writeEntry(outDir, entry);
  // stdout may carry a newline; the file must not.
  process.stdout.write(`${entry}\n`);
}

main().catch((error) => {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 1;
});
