import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { CHAPTERS, GUIDE_META } from "@/lib/guide-content";

// Brand colors (approx oklch → sRGB)
const ORANGE = rgb(0.85, 0.46, 0.22);
const INK = rgb(0.18, 0.16, 0.14);
const MUTED = rgb(0.45, 0.42, 0.4);
const RULE = rgb(0.88, 0.85, 0.82);
const CREAM = rgb(0.99, 0.97, 0.93);

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN_X = 56;
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 64;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

type Ctx = {
  pdf: PDFDocument;
  page: PDFPage;
  y: number;
  pageNum: number;
  serif: PDFFont;
  serifBold: PDFFont;
  sans: PDFFont;
  sansBold: PDFFont;
};

function ascii(s: string): string {
  // pdf-lib StandardFonts (WinAnsi) supports Latin-1; map common smart punctuation.
  return s
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\u2022/g, "•");
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.pdf.addPage([PAGE_W, PAGE_H]);
  ctx.pageNum += 1;
  ctx.y = PAGE_H - MARGIN_TOP;
  drawFooter(ctx);
}

function ensure(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN_BOTTOM) newPage(ctx);
}

function drawFooter(ctx: Ctx) {
  const label = `${GUIDE_META.title} — parqueto.fr`;
  ctx.page.drawText(ascii(label), {
    x: MARGIN_X,
    y: 32,
    size: 8,
    font: ctx.sans,
    color: MUTED,
  });
  const pn = String(ctx.pageNum);
  const w = ctx.sans.widthOfTextAtSize(pn, 9);
  ctx.page.drawText(pn, {
    x: PAGE_W - MARGIN_X - w,
    y: 32,
    size: 9,
    font: ctx.sansBold,
    color: ORANGE,
  });
}

function drawParagraph(
  ctx: Ctx,
  text: string,
  opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; lineGap?: number; indent?: number } = {}
) {
  const font = opts.font ?? ctx.sans;
  const size = opts.size ?? 10.5;
  const color = opts.color ?? INK;
  const lineGap = opts.lineGap ?? 4;
  const indent = opts.indent ?? 0;
  const maxW = CONTENT_W - indent;
  const lines = wrap(ascii(text), font, size, maxW);
  for (const line of lines) {
    ensure(ctx, size + lineGap);
    ctx.page.drawText(line, {
      x: MARGIN_X + indent,
      y: ctx.y - size,
      size,
      font,
      color,
    });
    ctx.y -= size + lineGap;
  }
}

function drawHr(ctx: Ctx, color = RULE) {
  ensure(ctx, 8);
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: ctx.y - 1,
    width: CONTENT_W,
    height: 0.6,
    color,
  });
  ctx.y -= 8;
}

function drawSpacer(ctx: Ctx, h: number) {
  ensure(ctx, h);
  ctx.y -= h;
}

function drawCover(ctx: Ctx) {
  // Cream background
  ctx.page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
  // Orange hairline
  ctx.page.drawRectangle({ x: 56, y: PAGE_H - 100, width: 80, height: 2, color: ORANGE });

  // Kicker
  ctx.page.drawText(ascii(GUIDE_META.edition.toUpperCase()), {
    x: 56,
    y: PAGE_H - 130,
    size: 9,
    font: ctx.sansBold,
    color: ORANGE,
  });

  // Title — two lines
  ctx.page.drawText("Le Guide Ultime", {
    x: 56,
    y: PAGE_H - 220,
    size: 44,
    font: ctx.serifBold,
    color: INK,
  });
  ctx.page.drawText("du Parquet", {
    x: 56,
    y: PAGE_H - 270,
    size: 44,
    font: ctx.serifBold,
    color: ORANGE,
  });

  // Hairline
  ctx.page.drawRectangle({ x: 56, y: PAGE_H - 310, width: 220, height: 1, color: ORANGE });

  // Subtitle
  ctx.page.drawText(ascii(GUIDE_META.subtitle), {
    x: 56,
    y: PAGE_H - 340,
    size: 14,
    font: ctx.serif,
    color: INK,
  });

  // Author
  ctx.page.drawText(ascii(GUIDE_META.author), {
    x: 56,
    y: 180,
    size: 11,
    font: ctx.sansBold,
    color: INK,
  });

  // Branding
  ctx.page.drawText("PARQUETO", {
    x: 56,
    y: 130,
    size: 18,
    font: ctx.serifBold,
    color: INK,
  });
  ctx.page.drawText(ascii(GUIDE_META.signature), {
    x: 56,
    y: 110,
    size: 10,
    font: ctx.serif,
    color: MUTED,
  });

  // Contact line bottom
  ctx.page.drawText("parqueto.fr  ·  contact@parqueto.fr  ·  01 84 60 60 61", {
    x: 56,
    y: 60,
    size: 8,
    font: ctx.sans,
    color: MUTED,
  });
}

function drawToc(ctx: Ctx) {
  newPage(ctx);
  ctx.page.drawText("Sommaire", {
    x: MARGIN_X,
    y: ctx.y - 28,
    size: 28,
    font: ctx.serifBold,
    color: INK,
  });
  ctx.y -= 60;
  for (const c of CHAPTERS) {
    ensure(ctx, 28);
    ctx.page.drawText(c.number, {
      x: MARGIN_X,
      y: ctx.y - 14,
      size: 14,
      font: ctx.serifBold,
      color: ORANGE,
    });
    ctx.page.drawText(ascii(c.title), {
      x: MARGIN_X + 40,
      y: ctx.y - 14,
      size: 13,
      font: ctx.serif,
      color: INK,
    });
    ctx.page.drawText(ascii(c.kicker), {
      x: MARGIN_X + 40,
      y: ctx.y - 28,
      size: 9,
      font: ctx.sans,
      color: MUTED,
    });
    ctx.y -= 38;
  }
}

function drawChapter(ctx: Ctx, c: (typeof CHAPTERS)[number]) {
  newPage(ctx);

  // Chapter header
  ctx.page.drawText(c.number, {
    x: MARGIN_X,
    y: ctx.y - 56,
    size: 64,
    font: ctx.serifBold,
    color: rgb(0.93, 0.78, 0.62),
  });
  ctx.page.drawText(ascii(c.kicker.toUpperCase()), {
    x: MARGIN_X,
    y: ctx.y - 90,
    size: 9,
    font: ctx.sansBold,
    color: ORANGE,
  });
  const titleLines = wrap(ascii(c.title), ctx.serifBold, 26, CONTENT_W);
  let ty = ctx.y - 112;
  for (const tl of titleLines) {
    ctx.page.drawText(tl, { x: MARGIN_X, y: ty, size: 26, font: ctx.serifBold, color: INK });
    ty -= 30;
  }
  ctx.y = ty - 8;
  drawHr(ctx, ORANGE);
  drawSpacer(ctx, 8);

  // Intro
  drawParagraph(ctx, c.intro, {
    font: ctx.serif,
    size: 12.5,
    color: rgb(0.22, 0.2, 0.18),
    lineGap: 5,
  });
  drawSpacer(ctx, 10);

  for (const s of c.sections) {
    ensure(ctx, 40);
    drawSpacer(ctx, 8);
    ctx.page.drawText(ascii(s.title), {
      x: MARGIN_X,
      y: ctx.y - 16,
      size: 16,
      font: ctx.serifBold,
      color: INK,
    });
    ctx.y -= 26;

    for (const b of s.blocks) {
      switch (b.type) {
        case "p":
          drawParagraph(ctx, b.text);
          drawSpacer(ctx, 6);
          break;
        case "lead":
          drawParagraph(ctx, b.text, { font: ctx.serif, size: 13, color: ORANGE, lineGap: 5 });
          drawSpacer(ctx, 8);
          break;
        case "h3":
          ensure(ctx, 22);
          drawSpacer(ctx, 4);
          ctx.page.drawText(ascii(b.text), {
            x: MARGIN_X,
            y: ctx.y - 13,
            size: 13,
            font: ctx.serifBold,
            color: INK,
          });
          ctx.y -= 20;
          break;
        case "list":
          for (const item of b.items) {
            ensure(ctx, 16);
            ctx.page.drawText("•", {
              x: MARGIN_X,
              y: ctx.y - 10,
              size: 10.5,
              font: ctx.sansBold,
              color: ORANGE,
            });
            drawParagraph(ctx, item, { indent: 14 });
            drawSpacer(ctx, 2);
          }
          drawSpacer(ctx, 4);
          break;
        case "tip":
          drawSpacer(ctx, 2);
          drawParagraph(ctx, "Astuce — " + b.text, {
            font: ctx.sans,
            size: 9.5,
            color: rgb(0.3, 0.27, 0.24),
            indent: 10,
          });
          drawSpacer(ctx, 6);
          break;
        case "callout": {
          // Estimate height
          const titleH = 14;
          const bodyLines = wrap(ascii(b.text), ctx.serif, 11, CONTENT_W - 24);
          const blockH = 18 + titleH + bodyLines.length * 15 + 14;
          ensure(ctx, blockH + 8);
          const top = ctx.y;
          ctx.page.drawRectangle({
            x: MARGIN_X,
            y: top - blockH,
            width: CONTENT_W,
            height: blockH,
            color: rgb(0.99, 0.94, 0.88),
            borderColor: ORANGE,
            borderWidth: 0.6,
          });
          ctx.page.drawText(ascii(b.title.toUpperCase()), {
            x: MARGIN_X + 12,
            y: top - 16,
            size: 8.5,
            font: ctx.sansBold,
            color: ORANGE,
          });
          let yy = top - 32;
          for (const line of bodyLines) {
            ctx.page.drawText(line, {
              x: MARGIN_X + 12,
              y: yy,
              size: 11,
              font: ctx.serif,
              color: INK,
            });
            yy -= 15;
          }
          ctx.y = top - blockH - 10;
          break;
        }
        case "table": {
          const cols = b.head.length;
          const colW = CONTENT_W / cols;
          // header
          ensure(ctx, 24);
          ctx.page.drawRectangle({
            x: MARGIN_X,
            y: ctx.y - 18,
            width: CONTENT_W,
            height: 18,
            color: rgb(0.96, 0.93, 0.88),
          });
          for (let i = 0; i < cols; i++) {
            ctx.page.drawText(ascii(b.head[i]), {
              x: MARGIN_X + i * colW + 6,
              y: ctx.y - 13,
              size: 9.5,
              font: ctx.sansBold,
              color: INK,
            });
          }
          ctx.y -= 18;
          // rows
          for (const row of b.rows) {
            // compute row height
            const cellLines = row.map((cell) => wrap(ascii(cell), ctx.sans, 9, colW - 12));
            const rowH = Math.max(...cellLines.map((l) => l.length)) * 12 + 6;
            ensure(ctx, rowH + 2);
            // alt bg
            ctx.page.drawLine({
              start: { x: MARGIN_X, y: ctx.y },
              end: { x: MARGIN_X + CONTENT_W, y: ctx.y },
              thickness: 0.4,
              color: RULE,
            });
            for (let i = 0; i < cols; i++) {
              let yy = ctx.y - 12;
              for (const line of cellLines[i]) {
                ctx.page.drawText(line, {
                  x: MARGIN_X + i * colW + 6,
                  y: yy,
                  size: 9,
                  font: ctx.sans,
                  color: rgb(0.25, 0.22, 0.2),
                });
                yy -= 12;
              }
            }
            ctx.y -= rowH;
          }
          drawSpacer(ctx, 10);
          break;
        }
        case "image":
          // skipped in PDF v1
          break;
      }
    }
  }
}

async function buildPdf(): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(GUIDE_META.title);
  pdf.setAuthor("Parqueto");
  pdf.setSubject(GUIDE_META.subtitle);
  pdf.setCreator("parqueto.fr");

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ctx: Ctx = {
    pdf,
    page: pdf.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - MARGIN_TOP,
    pageNum: 1,
    serif,
    serifBold,
    sans,
    sansBold,
  };

  drawCover(ctx);
  drawToc(ctx);
  for (const c of CHAPTERS) drawChapter(ctx, c);

  return pdf.save();
}

const InputSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).optional().nullable(),
  optIn: z.boolean().optional().default(true),
});

export const downloadGuidePdf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    // Lead capture (best-effort) using admin client to bypass auth context
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("guide_downloads" as never).insert({
        email: data.email,
        name: data.name ?? null,
        opt_in: data.optIn ?? true,
        source: "guide_pdf_download",
      } as never);
    } catch (e) {
      console.error("guide_downloads insert failed", e);
    }

    const bytes = await buildPdf();
    // Encode as base64 for JSON-safe transit
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(bin);
    return { base64, filename: "guide-ultime-du-parquet-parqueto.pdf" };
  });
