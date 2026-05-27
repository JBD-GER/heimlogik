type NormalizedUploadFile = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
};

type NormalizedReportImage = {
  fileName: string;
  mimeType: "image/jpeg" | "image/png";
  bytes: Buffer;
};

const heicMimeTypes = new Set(["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]);
const mimeTypeByExtension = new Map([
  [".avif", "image/avif"],
  [".bmp", "image/bmp"],
  [".gif", "image/gif"],
  [".heic", "image/heic"],
  [".heif", "image/heif"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".tif", "image/tiff"],
  [".tiff", "image/tiff"],
  [".webp", "image/webp"],
]);

function mimeTypeForFile(fileName: string, mimeType?: string | null) {
  const normalizedMime = mimeType?.trim();
  if (normalizedMime) return normalizedMime;

  const normalizedName = fileName.toLowerCase();
  const extension = normalizedName.match(/\.[^.]+$/)?.[0];
  return (extension && mimeTypeByExtension.get(extension)) || "application/octet-stream";
}

export function isHeicFile(fileName?: string | null, mimeType?: string | null) {
  const normalizedMime = mimeType?.toLowerCase() ?? "";
  const normalizedName = fileName?.toLowerCase() ?? "";
  return heicMimeTypes.has(normalizedMime) || normalizedName.endsWith(".heic") || normalizedName.endsWith(".heif");
}

function jpgName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "bild";
  return `${baseName}.jpg`;
}

async function convertHeicBufferToJpeg(buffer: Buffer) {
  const convert = (await import("heic-convert")).default;
  const converted = await convert({ buffer, format: "JPEG", quality: 0.86 });
  return Buffer.from(converted);
}

export async function normalizeUploadImageFile(file: File): Promise<NormalizedUploadFile> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const mimeType = mimeTypeForFile(file.name, file.type);

  if (!isHeicFile(file.name, mimeType)) {
    return {
      buffer: inputBuffer,
      fileName: file.name,
      mimeType,
      size: file.size,
    };
  }

  try {
    const jpegBuffer = await convertHeicBufferToJpeg(inputBuffer);

    return {
      buffer: jpegBuffer,
      fileName: jpgName(file.name),
      mimeType: "image/jpeg",
      size: jpegBuffer.length,
    };
  } catch {
    return {
      buffer: inputBuffer,
      fileName: file.name,
      mimeType,
      size: file.size,
    };
  }
}

export async function normalizeReportImage(fileName: string, mimeType: string | null, bytes: Buffer): Promise<NormalizedReportImage | null> {
  if (mimeType === "image/png") {
    return { fileName, mimeType: "image/png", bytes };
  }

  if (mimeType === "image/jpeg") {
    return { fileName, mimeType: "image/jpeg", bytes };
  }

  if (!isHeicFile(fileName, mimeType)) return null;

  try {
    const jpegBuffer = await convertHeicBufferToJpeg(bytes);
    return {
      fileName: jpgName(fileName),
      mimeType: "image/jpeg",
      bytes: jpegBuffer,
    };
  } catch {
    return null;
  }
}
