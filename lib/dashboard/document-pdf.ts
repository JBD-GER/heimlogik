import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PdfDocumentMeta = {
  title: string;
  subtitle: string;
  documentType: string;
  reference: string;
  createdAt: Date;
};

export type PdfParty = {
  label: string;
  name: string;
  lines: string[];
};

export type PdfSection = {
  title: string;
  body: string;
};

export type PdfLayoutMode = "document" | "din_letter";

const page = { width: 595.28, height: 841.89 };
const colors = {
  ink: rgb(0.09, 0.13, 0.11),
  muted: rgb(0.39, 0.45, 0.55),
  line: rgb(0.84, 0.87, 0.85),
  soft: rgb(0.96, 0.98, 0.96),
  accent: rgb(0.66, 1, 0.37),
  dark: rgb(0.06, 0.09, 0.07),
  white: rgb(1, 1, 1),
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function sanitize(text: string) {
  return text.replace(/[–—]/g, "-").replace(/[„“]/g, '"').replace(/[’]/g, "'");
}

export async function renderHeimlogikPdf({
  meta,
  party,
  sections,
  signature,
  layout = "document",
}: {
  meta: PdfDocumentMeta;
  party: PdfParty;
  sections: PdfSection[];
  layout?: PdfLayoutMode;
  signature?: {
    name: string;
    signedAt: Date;
    dataUrl: string;
  };
}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(meta.title);
  pdf.setAuthor("Heimlogik");
  pdf.setSubject(meta.documentType);
  pdf.setCreator("Heimlogik Dashboard");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = [pdf.addPage([page.width, page.height])];
  let currentPage = pages[0];
  let y = layout === "din_letter" ? 566 : 690;

  function drawHeader(target = currentPage) {
    target.drawRectangle({ x: 0, y: page.height - 118, width: page.width, height: 118, color: colors.dark });
    target.drawRectangle({ x: 0, y: page.height - 118, width: 10, height: 118, color: colors.accent });
    target.drawText("Heimlogik", { x: 44, y: page.height - 55, size: 18, font: bold, color: colors.white });
    target.drawText("SMART HOME  |  PLANUNG  |  SYSTEMINTEGRATION", { x: 44, y: page.height - 74, size: 7.5, font: regular, color: rgb(0.72, 0.78, 0.74) });
    target.drawRectangle({ x: page.width - 204, y: page.height - 80, width: 160, height: 46, color: rgb(0.09, 0.14, 0.11) });
    target.drawText(meta.documentType.toUpperCase(), { x: page.width - 188, y: page.height - 54, size: 8, font: bold, color: colors.accent });
    target.drawText(`Erstellt: ${formatDate(meta.createdAt)}`, { x: page.width - 188, y: page.height - 70, size: 8, font: regular, color: colors.white });
  }

  function drawFooter(target = currentPage, index = pages.indexOf(target) + 1) {
    target.drawLine({ start: { x: 44, y: 54 }, end: { x: page.width - 44, y: 54 }, thickness: 1, color: colors.line });
    target.drawText("Heimlogik | Interne Dokumentation | Vertraulich", { x: 44, y: 32, size: 7.8, font: regular, color: colors.muted });
    target.drawText(`Seite ${index}`, { x: page.width - 86, y: 32, size: 7.8, font: regular, color: colors.muted });
  }

  function addPage() {
    drawFooter(currentPage);
    currentPage = pdf.addPage([page.width, page.height]);
    pages.push(currentPage);
    drawHeader(currentPage);
    y = 690;
  }

  function ensureSpace(height: number) {
    if (y - height > 78) return;
    addPage();
  }

  function text(value: string, x: number, options: { size: number; font?: typeof regular; color?: ReturnType<typeof rgb>; maxChars?: number; lineHeight?: number }) {
    const lines = wrapText(sanitize(value), options.maxChars ?? 82);
    const lineHeight = options.lineHeight ?? options.size + 5;
    lines.forEach((line) => {
      currentPage.drawText(line, {
        x,
        y,
        size: options.size,
        font: options.font ?? regular,
        color: options.color ?? colors.ink,
      });
      y -= lineHeight;
    });
  }

  drawHeader();

  if (layout === "din_letter") {
    currentPage.drawText("Heimlogik | 31633 Leese | www.heimlogik.de", { x: 56, y: 694, size: 6.8, font: regular, color: colors.muted });
    currentPage.drawRectangle({ x: 50, y: 596, width: 248, height: 92, borderColor: colors.line, borderWidth: 0.8 });
    currentPage.drawText(party.name, { x: 66, y: 668, size: 10, font: bold, color: colors.ink });
    party.lines.slice(0, 4).forEach((line, index) => {
      currentPage.drawText(sanitize(line), { x: 66, y: 650 - index * 14, size: 9, font: regular, color: colors.ink });
    });
  }

  text(meta.documentType.toUpperCase(), 44, { size: 7.5, font: bold, color: colors.accent, maxChars: 80, lineHeight: 11 });
  y -= 8;
  text(meta.title, 44, { size: 29, font: bold, maxChars: 24, lineHeight: 32 });
  y -= 4;
  text(meta.subtitle, 44, { size: 11, color: colors.muted, maxChars: 68, lineHeight: 16 });

  const cardY = y - 130;
  currentPage.drawRectangle({ x: 44, y: cardY, width: page.width - 88, height: 112, color: colors.soft });
  currentPage.drawRectangle({ x: 44, y: cardY, width: 5, height: 112, color: colors.accent });
  currentPage.drawText(party.label.toUpperCase(), { x: 66, y: cardY + 86, size: 7.5, font: bold, color: colors.muted });
  currentPage.drawText(sanitize(party.name), { x: 66, y: cardY + 66, size: 14, font: bold, color: colors.ink });
  party.lines.slice(0, 4).forEach((line, index) => {
    currentPage.drawText(sanitize(line), { x: 66, y: cardY + 48 - index * 13, size: 9, font: regular, color: colors.muted });
  });
  currentPage.drawText("DOKUMENT", { x: 340, y: cardY + 86, size: 7.5, font: bold, color: colors.muted });
  currentPage.drawText(sanitize(meta.reference), { x: 340, y: cardY + 66, size: 12, font: bold, color: colors.ink });
  currentPage.drawText(`Datum: ${formatDate(meta.createdAt)}`, { x: 340, y: cardY + 47, size: 9, font: regular, color: colors.muted });
  currentPage.drawText("Status: unterschrieben", { x: 340, y: cardY + 34, size: 9, font: regular, color: colors.muted });
  y = cardY - 34;

  sections.forEach((section, index) => {
    ensureSpace(95);
    currentPage.drawCircle({ x: 52, y: y - 2, size: 8, color: index === 0 ? colors.accent : colors.soft });
    currentPage.drawText(String(index + 1), { x: 49, y: y - 5, size: 8, font: bold, color: colors.ink });
    currentPage.drawText(sanitize(section.title), { x: 70, y, size: 13, font: bold, color: colors.ink });
    y -= 22;
    text(section.body, 70, { size: 9.5, maxChars: 78, lineHeight: 14 });
    y -= 14;
  });

  ensureSpace(170);
  const sigY = y - 142;
  currentPage.drawRectangle({ x: 44, y: sigY, width: page.width - 88, height: 142, borderColor: colors.line, borderWidth: 1 });
  currentPage.drawText("Unterschrift", { x: 66, y: sigY + 112, size: 13, font: bold, color: colors.ink });
  currentPage.drawText(`Kundenname: ${sanitize(signature?.name ?? party.name)}`, { x: 66, y: sigY + 88, size: 9, font: regular, color: colors.muted });
  currentPage.drawText(`Datum: ${signature ? formatDate(signature.signedAt) : "________________"}`, { x: 66, y: sigY + 70, size: 9, font: regular, color: colors.muted });

  if (signature?.dataUrl) {
    const imageBytes = Buffer.from(signature.dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    const image = await pdf.embedPng(imageBytes);
    currentPage.drawImage(image, { x: 326, y: sigY + 54, width: 160, height: 48 });
  }

  currentPage.drawLine({ start: { x: 326, y: sigY + 42 }, end: { x: 500, y: sigY + 42 }, thickness: 1, color: colors.ink });
  currentPage.drawText("Unterschrift Kunde", { x: 326, y: sigY + 25, size: 8, font: regular, color: colors.muted });

  pages.forEach((item, index) => drawFooter(item, index + 1));

  return Buffer.from(await pdf.save());
}
