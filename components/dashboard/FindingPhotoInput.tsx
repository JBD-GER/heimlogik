"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

type SelectedPhoto = {
  id: string;
  file: File;
  previewUrl: string | null;
};

type FindingPhotoInputProps = {
  name?: string;
};

export function FindingPhotoInput({ name = "photos" }: FindingPhotoInputProps) {
  const submitInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<SelectedPhoto[]>([]);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    const input = submitInputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;

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

  function addFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? []);
    if (!nextFiles.length) return;

    setPhotos((current) => [
      ...current,
      ...nextFiles.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      })),
    ]);
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
          addFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,.pdf"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          addFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => cameraInputRef.current?.click()} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-700">
          <Camera className="h-4 w-4" aria-hidden="true" />
          Foto aufnehmen
        </button>
        <button type="button" onClick={() => galleryInputRef.current?.click()} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          Bilder hinzufügen
        </button>
      </div>

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
              <div className="flex items-center justify-between gap-2 p-2">
                <p className="truncate text-xs font-semibold text-slate-600">{photo.file.name}</p>
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
