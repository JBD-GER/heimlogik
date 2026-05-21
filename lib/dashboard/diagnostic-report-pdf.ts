import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { parseDiagnosticAnalysis } from "@/lib/dashboard/diagnostic-analysis";
import { diagnosticModuleLabel } from "@/lib/dashboard/diagnostics";
import { labelFor } from "@/lib/dashboard/labels";

type DiagnosticReportSignature = {
  label: string;
  name: string;
  signedAt: Date;
  dataUrl: string;
};

type DiagnosticReportPhoto = {
  fileName: string;
  mimeType: string | null;
  bytes: Buffer;
};

type DiagnosticReportModule = {
  module_type: string;
  title: string;
  affected_area?: string | null;
  affected_systems?: string[] | null;
  observation?: string | null;
  expected_state?: string | null;
  actual_state?: string | null;
  evidence?: string | null;
  recommendation?: string | null;
  severity?: string | null;
  notes?: string | null;
  photos?: DiagnosticReportPhoto[] | null;
};

type DiagnosticReportInput = {
  title: string;
  customerName: string;
  customerLines: string[];
  projectName: string;
  propertyName?: string | null;
  createdAt: Date;
  diagnostic: {
    title: string;
    customer_report?: string | null;
    problem_description?: string | null;
    internal_assessment?: string | null;
    error_category?: string | null;
    priority?: string | null;
    status?: string | null;
    checked_at?: string | null;
    result?: string | null;
    recommended_action?: string | null;
    effort_estimate?: string | null;
    ai_analysis?: string | null;
  };
  modules: DiagnosticReportModule[];
  signatures: DiagnosticReportSignature[];
};

type BoxRow = {
  label?: string;
  value?: string | null;
};

const page = { width: 595.28, height: 841.89 };
const layout = {
  left: 44,
  right: 44,
  top: 690,
  bottom: 76,
  contentWidth: page.width - 88,
};
const colors = {
  ink: rgb(0.09, 0.13, 0.11),
  muted: rgb(0.39, 0.45, 0.55),
  line: rgb(0.84, 0.87, 0.85),
  soft: rgb(0.96, 0.98, 0.96),
  paleGreen: rgb(0.94, 0.99, 0.94),
  accent: rgb(0.66, 1, 0.37),
  dark: rgb(0.06, 0.09, 0.07),
  white: rgb(1, 1, 1),
};

const estimateNotice =
  "Die ausgewiesenen Stunden- und Kostenwerte sind unverbindliche Orientierungs- und Schätzwerte auf Basis der dokumentierten Befunde. Sie stellen kein Angebot und keine Abrechnungssumme dar. Der tatsächliche Aufwand kann erst nach technischer Prüfung, Messung und konkreter Leistungsabgrenzung verbindlicher eingeordnet werden.";

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value ?? 0);
}

function sanitize(text: string) {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[„“]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function compactList(values?: string[] | null) {
  return values?.map((item) => item.trim()).filter(Boolean).join(", ") ?? "";
}

export async function renderDiagnosticReportPdf(input: DiagnosticReportInput) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(input.title);
  pdf.setAuthor("Heimlogik");
  pdf.setSubject("Diagnostikbericht");
  pdf.setCreator("Heimlogik Dashboard");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = [pdf.addPage([page.width, page.height])];
  let currentPage = pages[0];
  let y = layout.top;

  const structuredAnalysis = parseDiagnosticAnalysis(input.diagnostic.ai_analysis);
  const hasCustomerSignature = input.signatures.some((signature) => signature.label.toLowerCase().includes("kunde"));
  const appointmentType = hasCustomerSignature ? "Vor-Ort-Termin mit Kundenbestätigung" : "Ferndiagnose / ohne Kundenunterschrift";

  function drawHeader(target = currentPage) {
    target.drawRectangle({ x: 0, y: page.height - 118, width: page.width, height: 118, color: colors.dark });
    target.drawRectangle({ x: 0, y: page.height - 118, width: 10, height: 118, color: colors.accent });
    target.drawText("Heimlogik", { x: 44, y: page.height - 55, size: 18, font: bold, color: colors.white });
    target.drawText("SMART HOME  |  DIAGNOSTIK  |  SYSTEMINTEGRATION", {
      x: 44,
      y: page.height - 74,
      size: 7.5,
      font: regular,
      color: rgb(0.72, 0.78, 0.74),
    });
    target.drawRectangle({ x: page.width - 204, y: page.height - 80, width: 160, height: 46, color: rgb(0.09, 0.14, 0.11) });
    target.drawText("DIAGNOSTIKBERICHT", { x: page.width - 188, y: page.height - 54, size: 8, font: bold, color: colors.accent });
    target.drawText(`Erstellt: ${formatDate(input.createdAt)}`, { x: page.width - 188, y: page.height - 70, size: 8, font: regular, color: colors.white });
  }

  function drawFooter(target = currentPage, index = pages.indexOf(target) + 1) {
    target.drawLine({ start: { x: layout.left, y: 54 }, end: { x: page.width - layout.right, y: 54 }, thickness: 1, color: colors.line });
    target.drawText("Heimlogik | Diagnostikbericht | Vertraulich", { x: layout.left, y: 32, size: 7.8, font: regular, color: colors.muted });
    target.drawText(`Seite ${index}`, { x: page.width - 86, y: 32, size: 7.8, font: regular, color: colors.muted });
  }

  function addPage() {
    drawFooter(currentPage);
    currentPage = pdf.addPage([page.width, page.height]);
    pages.push(currentPage);
    drawHeader(currentPage);
    y = layout.top;
  }

  function forcePageBreak() {
    if (y >= layout.top - 2 && pages.length > 1) return;
    addPage();
  }

  function ensureSpace(height: number) {
    if (y - height > layout.bottom) return;
    addPage();
  }

  function wrapByWidth(value: string, maxWidth: number, size: number, font = regular) {
    const text = sanitize(value || "-");
    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          line = candidate;
          continue;
        }
        if (line) lines.push(line);
        if (font.widthOfTextAtSize(word, size) <= maxWidth) {
          line = word;
          continue;
        }
        let chunk = "";
        for (const char of word) {
          const nextChunk = `${chunk}${char}`;
          if (font.widthOfTextAtSize(nextChunk, size) <= maxWidth) {
            chunk = nextChunk;
          } else {
            if (chunk) lines.push(chunk);
            chunk = char;
          }
        }
        line = chunk;
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  function drawStaticText(value: string, x: number, startY: number, maxWidth: number, options: { size: number; font?: typeof regular; color?: ReturnType<typeof rgb>; lineHeight?: number; maxLines?: number }) {
    const font = options.font ?? regular;
    const lines = wrapByWidth(value, maxWidth, options.size, font).slice(0, options.maxLines ?? 99);
    const lineHeight = options.lineHeight ?? options.size + 4;
    lines.forEach((line, index) => {
      if (!line) return;
      currentPage.drawText(line, {
        x,
        y: startY - index * lineHeight,
        size: options.size,
        font,
        color: options.color ?? colors.ink,
      });
    });
    return lines.length * lineHeight;
  }

  function drawFlowText(value: string, x: number, maxWidth: number, options: { size: number; font?: typeof regular; color?: ReturnType<typeof rgb>; lineHeight?: number }) {
    const font = options.font ?? regular;
    const lineHeight = options.lineHeight ?? options.size + 4;
    const lines = wrapByWidth(value, maxWidth, options.size, font);
    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      if (line) {
        currentPage.drawText(line, {
          x,
          y,
          size: options.size,
          font,
          color: options.color ?? colors.ink,
        });
      }
      y -= lineHeight;
    }
  }

  function sectionTitle(title: string) {
    if (y < layout.top - 2) y -= 18;
    ensureSpace(58);
    currentPage.drawText(sanitize(title), { x: layout.left, y, size: 15, font: bold, color: colors.ink });
    y -= 32;
  }

  function estimateRows(rows: BoxRow[], maxWidth: number) {
    return rows
      .filter((row) => row.value)
      .reduce((height, row) => {
        const labelHeight = row.label ? 11 : 0;
        const valueLines = wrapByWidth(row.value ?? "", maxWidth, 8.8, regular).length;
        return height + labelHeight + Math.max(12, valueLines * 12) + 8;
      }, 0);
  }

  async function drawPhotoStrip(photos: DiagnosticReportPhoto[], x: number, topY: number, width: number) {
    const imagePhotos = photos
      .filter((photo) => (photo.mimeType === "image/png" || photo.mimeType === "image/jpeg") && photo.bytes.length)
      .slice(0, 3);
    if (!imagePhotos.length) return;

    const gap = 6;
    const itemWidth = (width - gap * (imagePhotos.length - 1)) / imagePhotos.length;
    const itemHeight = 58;

    for (const [index, photo] of imagePhotos.entries()) {
      const itemX = x + index * (itemWidth + gap);
      currentPage.drawRectangle({ x: itemX, y: topY - itemHeight, width: itemWidth, height: itemHeight, color: colors.soft, borderColor: colors.line, borderWidth: 0.6 });
      try {
        const image = photo.mimeType === "image/png" ? await pdf.embedPng(photo.bytes) : await pdf.embedJpg(photo.bytes);
        const scale = Math.min((itemWidth - 4) / image.width, (itemHeight - 4) / image.height);
        currentPage.drawImage(image, {
          x: itemX + (itemWidth - image.width * scale) / 2,
          y: topY - itemHeight + (itemHeight - image.height * scale) / 2,
          width: image.width * scale,
          height: image.height * scale,
        });
      } catch {
        drawStaticText(photo.fileName, itemX + 4, topY - 20, itemWidth - 8, { size: 6.8, color: colors.muted, maxLines: 3 });
      }
    }
  }

  async function infoBox({
    eyebrow,
    title,
    rows,
    accent = false,
    photos = [],
  }: {
    eyebrow?: string;
    title: string;
    rows: BoxRow[];
    accent?: boolean;
    photos?: DiagnosticReportPhoto[];
  }) {
    const x = layout.left;
    const width = layout.contentWidth;
    const padding = 16;
    const hasPhotos = photos.some((photo) => photo.mimeType === "image/png" || photo.mimeType === "image/jpeg");
    const photoWidth = hasPhotos ? 132 : 0;
    const textWidth = width - padding * 2 - photoWidth - (hasPhotos ? 18 : 0);
    const normalizedRows = rows
      .filter((row) => row.value)
      .flatMap((row) => {
        const lines = wrapByWidth(row.value ?? "", textWidth, 8.8, regular);
        if (lines.length <= 24) return [row];
        const chunks: BoxRow[] = [];
        for (let index = 0; index < lines.length; index += 24) {
          chunks.push({
            label: index === 0 ? row.label : `${row.label ?? "Text"} (Fortsetzung)`,
            value: lines.slice(index, index + 24).join("\n"),
          });
        }
        return chunks;
      });
    const titleLines = wrapByWidth(title, textWidth, 11.4, bold);
    const bodyHeight = estimateRows(normalizedRows, textWidth);
    const photoHeight = hasPhotos ? 76 : 0;
    const boxHeight = Math.max(76, padding * 2 + (eyebrow ? 12 : 0) + titleLines.length * 14 + 10 + bodyHeight, padding * 2 + 22 + photoHeight);
    const maxBoxHeight = layout.top - layout.bottom - 18;

    if (boxHeight > maxBoxHeight && normalizedRows.length > 1) {
      await infoBox({ eyebrow, title, rows: [normalizedRows[0]], accent, photos });
      for (const continuationRow of normalizedRows.slice(1)) {
        await infoBox({
          eyebrow: "FORTSETZUNG",
          title: continuationRow.label ?? title,
          rows: [{ value: continuationRow.value }],
          accent,
        });
      }
      return;
    }

    ensureSpace(boxHeight + 10);
    const topY = y;
    const bottomY = y - boxHeight;
    currentPage.drawRectangle({
      x,
      y: bottomY,
      width,
      height: boxHeight,
      color: accent ? colors.paleGreen : rgb(0.995, 0.997, 0.995),
      borderColor: colors.line,
      borderWidth: 0.8,
    });
    currentPage.drawRectangle({ x, y: bottomY, width: 4, height: boxHeight, color: accent ? colors.accent : colors.line });

    let localY = topY - padding;
    if (eyebrow) {
      currentPage.drawText(sanitize(eyebrow), { x: x + padding, y: localY, size: 7.2, font: bold, color: accent ? rgb(0.07, 0.47, 0.19) : colors.muted });
      localY -= 13;
    }
    titleLines.forEach((line) => {
      currentPage.drawText(line, { x: x + padding, y: localY, size: 11.4, font: bold, color: colors.ink });
      localY -= 14;
    });
    localY -= 4;

    for (const row of normalizedRows) {
      if (row.label) {
        currentPage.drawText(sanitize(row.label), { x: x + padding, y: localY, size: 7, font: bold, color: colors.muted });
        localY -= 11;
      }
      const lines = wrapByWidth(row.value ?? "", textWidth, 8.8, regular);
      for (const line of lines) {
        if (line) currentPage.drawText(line, { x: x + padding, y: localY, size: 8.8, font: regular, color: colors.ink });
        localY -= 12;
      }
      localY -= 8;
    }

    if (hasPhotos) {
      await drawPhotoStrip(photos, x + width - padding - photoWidth, topY - padding - 18, photoWidth);
      if (photos.length > 3) {
        currentPage.drawText(`+${photos.length - 3} weitere Nachweise`, { x: x + width - padding - photoWidth, y: bottomY + 14, size: 7, font: regular, color: colors.muted });
      }
    }

    y = bottomY - 14;
  }

  function summaryMetrics() {
    if (!structuredAnalysis) return;
    ensureSpace(66);
    const gap = 10;
    const width = (layout.contentWidth - gap * 2) / 3;
    const boxY = y - 50;
    const items = [
      ["GESAMTSTATUS", structuredAnalysis.overall_status || "-"],
      ["AUFWAND", `${structuredAnalysis.estimated_total_hours_min}-${structuredAnalysis.estimated_total_hours_max} h`],
      ["KOSTENRAHMEN", `${formatCurrency(structuredAnalysis.estimated_total_cost_min)}-${formatCurrency(structuredAnalysis.estimated_total_cost_max)}`],
    ];
    items.forEach(([label, value], index) => {
      const x = layout.left + index * (width + gap);
      currentPage.drawRectangle({ x, y: boxY, width, height: 50, color: colors.soft, borderColor: colors.line, borderWidth: 0.5 });
      currentPage.drawText(label, { x: x + 12, y: boxY + 31, size: 7.2, font: bold, color: colors.muted });
      drawStaticText(value, x + 12, boxY + 15, width - 24, { size: 8.6, font: bold, maxLines: 1 });
    });
    y = boxY - 18;
  }

  drawHeader();
  y -= 28;
  currentPage.drawText("DIAGNOSTIKBERICHT", { x: layout.left, y, size: 7.5, font: bold, color: colors.accent });
  y -= 22;
  drawFlowText(input.diagnostic.title, layout.left, 370, { size: 23, font: bold, lineHeight: 26 });
  y -= 8;
  drawFlowText("Offizieller Bericht zur dokumentierten Ist-Situation, technischen Prüfung und Ursachenanalyse.", layout.left, 410, { size: 10.5, color: colors.muted, lineHeight: 15 });
  y -= 16;

  const cardHeight = 126;
  ensureSpace(cardHeight + 20);
  const cardY = y - cardHeight;
  currentPage.drawRectangle({ x: layout.left, y: cardY, width: layout.contentWidth, height: cardHeight, color: colors.soft });
  currentPage.drawRectangle({ x: layout.left, y: cardY, width: 5, height: cardHeight, color: colors.accent });
  currentPage.drawText("KUNDE", { x: 66, y: cardY + 98, size: 7.5, font: bold, color: colors.muted });
  drawStaticText(input.customerName, 66, cardY + 78, 220, { size: 13, font: bold, maxLines: 2 });
  input.customerLines.slice(0, 4).forEach((line, index) => {
    drawStaticText(line, 66, cardY + 50 - index * 13, 220, { size: 8.5, color: colors.muted, maxLines: 1 });
  });
  currentPage.drawText("PROJEKT / TERMIN", { x: 330, y: cardY + 98, size: 7.5, font: bold, color: colors.muted });
  drawStaticText(input.projectName, 330, cardY + 78, 190, { size: 11.5, font: bold, maxLines: 2 });
  drawStaticText(input.propertyName ?? "ohne Objektangabe", 330, cardY + 50, 190, { size: 8.5, color: colors.muted, maxLines: 1 });
  drawStaticText(`Terminart: ${appointmentType}`, 330, cardY + 36, 190, { size: 8.5, color: colors.muted, maxLines: 2 });
  drawStaticText(`Status: ${labelFor(input.diagnostic.status)}`, 330, cardY + 16, 190, { size: 8.5, color: colors.muted, maxLines: 1 });
  y = cardY - 24;

  await infoBox({
    title: "Kundenmeldung",
    rows: [{ value: input.diagnostic.customer_report }],
  });
  await infoBox({
    title: "Dokumentierte Ausgangslage",
    rows: [{ value: input.diagnostic.problem_description }],
    accent: true,
  });
  forcePageBreak();

  if (structuredAnalysis) {
    sectionTitle("Zusammenfassung");
    await infoBox({
      eyebrow: "TECHNISCHE BEWERTUNG",
      title: "Gesamtbewertung",
      rows: [
        { label: "Zusammenfassung", value: structuredAnalysis.summary },
        { label: "Empfohlene Vorgehensweise", value: structuredAnalysis.overall_recommendation },
      ],
      accent: true,
    });
    summaryMetrics();
  }

  sectionTitle("Befunde und Bewertung");
  for (const [index, item] of input.modules.entries()) {
    const finding = structuredAnalysis?.findings[index];
    await infoBox({
      eyebrow: `BEFUND ${index + 1}`,
      title: item.title,
      photos: item.photos ?? [],
      rows: [
        { label: "Einordnung", value: `${diagnosticModuleLabel(item.module_type)} · ${labelFor(item.severity)}${item.affected_area ? ` · ${item.affected_area}` : ""}` },
        { label: "Betroffene Systeme", value: compactList(item.affected_systems) },
        { label: "Ist-Situation", value: item.observation },
        { label: "Soll-Zustand / gewünschte Funktion", value: item.expected_state },
        { label: "Nachweise", value: item.photos?.length ? `${item.photos.length} Bild-/Dateinachweis(e)` : item.evidence },
        { label: "Interne Notiz", value: item.notes },
      ],
      accent: false,
    });

    if (finding) {
      await infoBox({
        eyebrow: `ANALYSE ZU BEFUND ${index + 1}`,
        title: "Technische Bewertung",
        rows: [
          { label: "Bewertung", value: finding.assessment },
          {
            label: "Mögliche Ursachen",
            value: finding.possible_causes
              .map((cause) => `${cause.cause}${cause.likelihood ? ` (${cause.likelihood})` : ""}${cause.rationale ? `: ${cause.rationale}` : ""}`)
              .join("\n"),
          },
          { label: "Empfohlene Prüfungen", value: finding.recommended_checks.join("\n") },
          { label: "Empfohlene Maßnahmen", value: finding.recommended_actions.join("\n") },
          { label: "Aufwand / Kosten", value: `${finding.effort_hours_min}-${finding.effort_hours_max} h · ${formatCurrency(finding.cost_min)}-${formatCurrency(finding.cost_max)}\nUnverbindlicher Schätzwert auf Basis der dokumentierten Befunde.` },
          { label: "Hinweis", value: finding.customer_note },
        ],
        accent: true,
      });
    }

    if (index < input.modules.length - 1) {
      forcePageBreak();
    }
  }

  if (structuredAnalysis?.required_material_or_external_services.length) {
    await infoBox({
      title: "Material / Fremdleistungen",
      rows: [{ value: structuredAnalysis.required_material_or_external_services.join("\n") }],
    });
  }

  if (structuredAnalysis?.limitations.length || structuredAnalysis?.cost_basis) {
    await infoBox({
      title: "Hinweise und Kalkulationsgrundlage",
      rows: [
        { label: "Abgrenzung", value: structuredAnalysis.limitations.join("\n") },
        { label: "Stunden- und Kostenwerte", value: estimateNotice },
        { label: "Kalkulationsgrundlage", value: structuredAnalysis.cost_basis },
      ],
    });
  }

  ensureSpace(input.signatures.length ? 170 : 95);
  sectionTitle("Unterschriften zur Ist-Situation");
  if (!input.signatures.length) {
    drawFlowText("Dieser Bericht wurde ohne digitale Unterschrift erzeugt.", layout.left, layout.contentWidth, { size: 9, color: colors.muted });
  }

  for (const signature of input.signatures) {
    ensureSpace(116);
    const sigY = y - 96;
    currentPage.drawRectangle({ x: layout.left, y: sigY, width: layout.contentWidth, height: 98, borderColor: colors.line, borderWidth: 1 });
    currentPage.drawText(sanitize(signature.label), { x: 62, y: sigY + 72, size: 10, font: bold, color: colors.ink });
    currentPage.drawText(`${sanitize(signature.name)} · ${formatDate(signature.signedAt)}`, { x: 62, y: sigY + 55, size: 8.5, font: regular, color: colors.muted });
    const imageBytes = Buffer.from(signature.dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    const image = await pdf.embedPng(imageBytes);
    currentPage.drawImage(image, { x: 340, y: sigY + 33, width: 150, height: 43 });
    currentPage.drawLine({ start: { x: 340, y: sigY + 25 }, end: { x: 504, y: sigY + 25 }, thickness: 1, color: colors.ink });
    y = sigY - 22;
  }

  pages.forEach((item, index) => drawFooter(item, index + 1));
  return Buffer.from(await pdf.save());
}
