"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

type SelectedPhoto = {
  id: string;
  file: File;
  originalSize: number;
  optimized: boolean;
  warning?: string;
  previewUrl: string | null;
};

type FindingPhotoInputProps = {
  name?: string;
};

const maxImageDimension = 1800;
const jpegQuality = 0.78;
const compressFromBytes = 900 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

function imageNeedsCompression(file: File) {
  return file.type.startsWith("image/") && file.size >= compressFromBytes;
}

function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bild konnte im Browser nicht gelesen werden."));
    };
    image.src = url;
  });
}

async function compressImageFile(file: File) {
  if (!imageNeedsCompression(file)) {
    return { file, originalSize: file.size, optimized: false };
  }

  try {
    const image = await loadImageFromFile(file);
    const scale = Math.min(1, maxImageDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Bildoptimierung ist auf diesem Gerät nicht verfügbar.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", jpegQuality));
    if (!blob || blob.size >= file.size) {
      return { file, originalSize: file.size, optimized: false };
    }

    const nextName = file.name.replace(/\.[^.]+$/, "") || "befund-foto";
    return {
      file: new File([blob], `${nextName}.jpg`, { type: "image/jpeg", lastModified: Date.now() }),
      originalSize: file.size,
      optimized: true,
    };
  } catch {
    return {
      file,
      originalSize: file.size,
      optimized: false,
      warning: "Dieses Bild konnte nicht automatisch verkleinert werden. Falls der Upload scheitert, bitte als JPEG aufnehmen.",
    };
  }
}

export function FindingPhotoInput({ name = "photos" }: FindingPhotoInputProps) {
  const submitInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<SelectedPhoto[]>([]);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncWarning, setSyncWarning] = useState("");

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    const input = submitInputRef.current;
    if (!input) return;
    if (typeof DataTransfer === "undefined") {
      setSyncWarning("Dieser Browser kann die ausgewählten Fotos nicht sicher an das Formular übergeben. Bitte Safari/Chrome aktualisieren.");
      return;
    }

    const transfer = new DataTransfer();
    photos.forEach((photo) => transfer.items.add(photo.file));
    input.files = transfer.files;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, []);

  async function addFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []);
    if (!nextFiles.length) return;

    setIsProcessing(true);
    const processedFiles = await Promise.all(nextFiles.map((file) => compressImageFile(file)));
    setPhotos((current) => {
      const nextPhotos = processedFiles.map(({ file, originalSize, optimized, warning }) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        originalSize,
        optimized,
        warning,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }));
      return [...current, ...nextPhotos];
    });
    setIsProcessing(false);
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="grid gap-3">
      <input ref={submitInputRef} name={name} type="file" multiple className="sr-only" tabIndex={-1} aria-hidden="true" />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          void addFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,.pdf,application/pdf"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          void addFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={isProcessing} onClick={() => cameraInputRef.current?.click()} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
          <Camera className="h-4 w-4" aria-hidden="true" />
          {isProcessing ? "Foto wird optimiert..." : "Foto aufnehmen"}
        </button>
        <button type="button" disabled={isProcessing} onClick={() => galleryInputRef.current?.click()} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          Bilder hinzufügen
        </button>
      </div>
      <p className="text-xs leading-5 text-slate-500">Große iPad-Fotos werden automatisch verkleinert, bevor sie hochgeladen werden.</p>
      {syncWarning ? <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">{syncWarning}</p> : null}

      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <div className="flex aspect-[4/3] items-center justify-center bg-slate-100">
                {photo.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.previewUrl} alt={photo.file.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="px-3 text-center text-xs font-semibold text-slate-500">{photo.file.name}</span>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 p-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700">{photo.file.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    {photo.optimized ? `${formatBytes(photo.originalSize)} -> ${formatBytes(photo.file.size)}` : formatBytes(photo.file.size)}
                  </p>
                  {photo.warning ? <p className="mt-1 text-[11px] leading-4 text-amber-700">{photo.warning}</p> : null}
                </div>
                <button type="button" onClick={() => removePhoto(photo.id)} className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100" aria-label={`${photo.file.name} entfernen`}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
