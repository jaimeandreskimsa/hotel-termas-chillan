
"use client";
import { useState } from "react";

interface PageHeroProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  height?: string;
  gradient?: string;
}

export default function PageHero({ title, imageSrc, imageAlt, height = "h-48", gradient = "from-[#1B4332] to-[#2D6A4F]" }: PageHeroProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-b-3xl`}>
      {imageSrc && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt ?? title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
      )}
      <div className="absolute inset-0 bg-black/35 flex items-end p-5">
        <h1 className="font-playfair text-white text-[32px] font-bold drop-shadow-lg">{title}</h1>
      </div>
    </div>
  );
}
