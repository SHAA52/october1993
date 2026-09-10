"use client";

import { useEffect, useState } from "react";
import { loadGzippedAsset } from "./assetLoader";

const BOOK_PARTS = 13;

export function BookReader() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    loadGzippedAsset("book", BOOK_PARTS, "application/pdf")
      .then((url) => {
        objectUrl = url;
        if (active) setPdfUrl(url);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  if (error) {
    return (
      <section className="reader-shell pdf-reader-shell" aria-label="Текст книги">
        <div className="reader-status">Не удалось загрузить книгу. Обновите страницу и попробуйте снова.</div>
      </section>
    );
  }

  if (!pdfUrl) {
    return (
      <section className="reader-shell pdf-reader-shell" aria-label="Загрузка книги">
        <div className="reader-status">Загружается полная версия книги · 106 страниц…</div>
      </section>
    );
  }

  return (
    <section className="reader-shell pdf-reader-shell" aria-label="Текст книги в печатной верстке">
      <div className="pdf-reader-toolbar">
        <span>Полная печатная версия книги · 106 страниц</span>
        <a href={pdfUrl} target="_blank" rel="noreferrer">Открыть PDF ↗</a>
      </div>
      <div className="pdf-reader-frame-wrap">
        <iframe
          className="pdf-reader-frame"
          src={`${pdfUrl}#page=2&view=FitH`}
          title="Уроки Великого Октября — печатная версия"
        />
      </div>
      <p className="pdf-reader-fallback">
        Если встроенный просмотр PDF не поддерживается вашим браузером, <a href={pdfUrl} target="_blank" rel="noreferrer">откройте книгу отдельной вкладкой</a>.
      </p>
    </section>
  );
}
