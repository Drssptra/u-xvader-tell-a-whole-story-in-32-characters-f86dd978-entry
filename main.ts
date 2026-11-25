// Tell a Whole Story in 32 Characters — make.fun entry.
//
// The entry is one Wi-Fi network name that carries a whole divorce in
// a single SSID. The joke: when the marriage ended, the settlement's
// most contested asset was not the house or the car — it was the Wi-Fi.
// One line, no spaces, so a passer-by reading a phone's network list
// gets the punchline and can fill in the rest: the lawyers, the split,
// and him, staring at a router that is no longer his.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "SheTookTheWiFiInTheDivorce";
const MAX_CHARS = 32;

const chars = [...ENTRY].length;
if (chars < 1 || chars > MAX_CHARS) {
  throw new Error(
    `gate: entry must be 1-${MAX_CHARS} characters, got ${chars}`,
  );
}
if (ENTRY.trim().length === 0) {
  throw new Error("gate: entry must not be only whitespace");
}
if (/[\r\n]/.test(ENTRY)) {
  throw new Error("gate: entry must be a single line of text");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// entry.txt carries the exact entry text with no trailing newline; the
// gate counts every byte, so nothing extra may ride along. stdout gets
// the same text plus a newline for a human reading the terminal.
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
process.stdout.write(`${ENTRY}\n`);
