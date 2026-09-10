"use client";

import { useEffect, useState } from "react";
import { loadImageAsset } from "./assetLoader";

type ChunkedImageProps = {
  asset: "cover" | "author";
  parts: number;
  alt: string;
  className: string;
};

export function ChunkedImage({ asset, parts, alt, className }: ChunkedImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    loadImageAsset(asset, parts, "image/webp")
      .then((url) => {
        objectUrl = url;
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asset, parts]);

  if (failed) {
    return <div className={`${className} asset-placeholder`} role="img" aria-label={alt}>Изображение временно недоступно</div>;
  }

  if (!src) {
    return <div className={`${className} asset-placeholder asset-loading`} aria-label="Загрузка изображения" />;
  }

  return <img src={src} alt={alt} className={className} />;
}
