import Image from "next/image";

type ImageFeatureProps = {
  src: string;
  alt: string;
  label?: string;
};

export function ImageFeature({ src, alt, label }: ImageFeatureProps) {
  return (
    <figure className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
      <div className="relative aspect-[3/2]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
      </div>
      {label ? <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{label}</figcaption> : null}
    </figure>
  );
}
