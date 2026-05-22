/**
 * Parse OCR'd guide text into structured blocks for rich rendering.
 * Heuristics, not perfect — designed to handle the Parqueto guide style.
 */

/**
 * Replace fictitious / outdated coordinates that were printed on the original
 * PDF sample pages (Casablanca address, +212 number, .ma domain, sample client
 * details) with the real Parqueto FR coordinates.
 */
export function sanitizeGuideText(raw: string): string {
  if (!raw) return raw;
  return raw
    // Address lines — strip entirely
    .replace(/Route d'?El Jadida[^\n]*/gi, "")
    .replace(/\d{2,5}[, ]+Rue des Orangers[^\n]*/gi, "")
    .replace(/20\d{3}\s+Casablanca/gi, "75000 Paris")
    // Phones
    .replace(/0\s?5\s?22\s?45\s?67\s?89/g, "01 84 60 60 61")
    .replace(/0\s?6\s?12\s?34\s?56\s?78/g, "01 84 60 60 61")
    // Email & web
    .replace(/contact@parqueto\.ma/gi, "contact@parqueto.fr")
    .replace(/www\.parqueto\.ma/gi, "parqueto.fr")
    .replace(/parqueto\.ma/gi, "parqueto.fr")
    .replace(/y\.benali@email\.com/gi, "contact@parqueto.fr")
    // Sample client name on the quote template
    .replace(/M\.?\s*Youssef\s+Benali/gi, "M. / Mme Client")
    // Sample quote reference dates
    .replace(/DEV-2024-\d{4}/g, "DEV-AAAA-NNNN")
    // Collapse leftover empty lines / double commas
    .replace(/,\s*,/g, ",")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}


export type TextBlock =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "chapter"; number?: string; text: string }
  | { kind: "callout"; label: string; body: string[] }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "tagline"; text: string }
  | { kind: "brand"; text: string };

const CALLOUT_LABELS = [
  "LE SAVIEZ-VOUS",
  "À RETENIR",
  "A RETENIR",
  "LE CONSEIL PARQUETO",
  "NOS 3 RÈGLES D'OR",
  "NOS 3 REGLES D'OR",
  "MOT DE L'AUTEUR",
  "CONSEIL DÉCO",
  "CONSEIL DECO",
  "NOS RECOMMANDATIONS",
  "NOS ENGAGEMENTS",
  "IDÉAL POUR",
  "IDEAL POUR",
  "À ASSOCIER AVEC",
  "A ASSOCIER AVEC",
];

const BRAND_NOISE = [
  /^P{1,2}ARQUETO$/i,
  /^Le parquet, sans détour\.?$/i,
  /^LE SPÉCIALISTE\s*DU PARQUET$/i,
  /^\d{1,3}$/, // page numbers
];

function isUpperLine(line: string): boolean {
  const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length < 3) return false;
  const upper = line.replace(/[^A-ZÀ-Ÿ]/g, "");
  return upper.length / letters.length > 0.85;
}

function isNoise(line: string): boolean {
  return BRAND_NOISE.some((rx) => rx.test(line.trim()));
}

function matchesCallout(line: string): string | null {
  const t = line.trim().replace(/[?!:.]+$/g, "").toUpperCase();
  return CALLOUT_LABELS.find((l) => t === l || t.startsWith(l)) ?? null;
}

const CHAPTER_RE = /^CHAPITRE\s+(\d+)\s*[:.\-]?\s*(.*)$/i;

export function parseGuideText(raw: string): TextBlock[] {
  if (!raw?.trim()) return [];

  const rawLines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !isNoise(l));

  const blocks: TextBlock[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // Chapter marker
    const ch = line.match(CHAPTER_RE);
    if (ch) {
      // Possibly the next line is the chapter subtitle
      const next = rawLines[i + 1];
      const subtitle = next && isUpperLine(next) ? `${ch[2]} ${next}`.trim() : ch[2];
      blocks.push({ kind: "chapter", number: ch[1], text: subtitle || `Chapitre ${ch[1]}` });
      i += next && isUpperLine(next) && !ch[2] ? 2 : 1;
      continue;
    }

    // Callout
    const calloutLabel = matchesCallout(line);
    if (calloutLabel) {
      const body: string[] = [];
      let j = i + 1;
      // Collect 1-6 following lines until next heading/callout/list marker
      while (j < rawLines.length && body.length < 6) {
        const nxt = rawLines[j];
        if (matchesCallout(nxt)) break;
        if (CHAPTER_RE.test(nxt)) break;
        if (/^[-•·]\s/.test(nxt)) break;
        if (isUpperLine(nxt) && nxt.length > 10 && nxt.length < 60) break;
        body.push(nxt);
        j++;
        // Stop if we've grabbed a sentence
        if (body.join(" ").length > 280) break;
      }
      blocks.push({ kind: "callout", label: line.replace(/[?:.!]+$/, ""), body });
      i = j;
      continue;
    }

    // List
    if (/^[-•·]\s/.test(line)) {
      const items: string[] = [];
      while (i < rawLines.length && /^[-•·]\s/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^[-•·]\s*/, ""));
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    // Heading (uppercase, short-medium)
    if (isUpperLine(line) && line.length <= 80) {
      blocks.push({
        kind: "heading",
        level: line.length < 30 ? 2 : 3,
        text: toTitleCase(line),
      });
      i++;
      continue;
    }

    // Final tagline (italic, ends in BIEN CHOISIR...)
    if (/BIEN CHOISIR AUJOURD'?HUI/i.test(line)) {
      blocks.push({ kind: "tagline", text: line });
      i++;
      continue;
    }

    // Default paragraph — merge short consecutive lines
    let buf = line;
    let j = i + 1;
    while (j < rawLines.length) {
      const nxt = rawLines[j];
      if (
        isUpperLine(nxt) ||
        matchesCallout(nxt) ||
        CHAPTER_RE.test(nxt) ||
        /^[-•·]\s/.test(nxt)
      )
        break;
      buf += " " + nxt;
      j++;
      if (buf.length > 600) break;
    }
    blocks.push({ kind: "paragraph", text: buf });
    i = j;
  }

  return mergeShortParas(blocks);
}

function mergeShortParas(blocks: TextBlock[]): TextBlock[] {
  const out: TextBlock[] = [];
  for (const b of blocks) {
    const last = out[out.length - 1];
    if (
      b.kind === "paragraph" &&
      last?.kind === "paragraph" &&
      last.text.length < 80 &&
      b.text.length < 200
    ) {
      last.text = `${last.text} ${b.text}`;
      continue;
    }
    out.push(b);
  }
  return out;
}

function toTitleCase(s: string): string {
  // Keep acronyms (DTU, IA, PVC, LVT, HDF), lower others
  return s
    .toLowerCase()
    .replace(/\b([a-zà-ÿ])/g, (m) => m.toUpperCase())
    .replace(/\b(Dtu|Ia|Pvc|Lvt|Hdf|Mdf|Qr)\b/g, (m) => m.toUpperCase());
}
