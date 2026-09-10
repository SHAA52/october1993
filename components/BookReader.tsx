"use client";

import { useEffect, useState } from "react";
import { loadGzippedJson } from "./assetLoader";

const BOOK_PARTS = 8;

export function BookReader() {
  const [pages, setPages] = useState<string[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    loadGzippedJson<string[]>("book-text", BOOK_PARTS)
      .then((data) => {
        if (active) setPages(data);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <section className="reader-shell" aria-label="Текст книги">
        <div className="reader-status">Не удалось загрузить книгу. Обновите страницу и попробуйте снова.</div>
      </section>
    );
  }

  if (!pages) {
    return (
      <section className="reader-shell" aria-label="Загрузка книги">
        <div className="reader-status">Загружается полная версия книги · 106 страниц…</div>
      </section>
    );
  }

  return (
    <section className="reader-shell" aria-label="Полный текст книги">
      <div className="reader-status">Полный текст книги · {pages.length} страниц</div>
      <div style={{ display: "grid", gap: 24, padding: 24 }}>
        {pages.map((page, index) => (
          <article
            id={`page-${index + 1}`}
            key={index}
            style={{
              width: "100%",
              maxWidth: 860,
              minHeight: 420,
              margin: "0 auto",
              padding: "clamp(24px, 5vw, 64px)",
              background: "#fff",
              color: "#171717",
              boxShadow: "0 8px 30px rgba(0,0,0,.12)",
            }}
          >
            <div style={{ marginBottom: 24, color: "#777", font: "600 12px/1.2 system-ui, sans-serif", letterSpacing: ".08em" }}>
              {index + 1}
            </div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", font: "400 17px/1.65 Georgia, 'Times New Roman', serif" }}>
              {page}
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}
