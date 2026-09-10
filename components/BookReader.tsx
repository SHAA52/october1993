"use client";

import { useEffect, useState } from "react";

const RAW_BASE = "https://raw.githubusercontent.com/SHAA52/october1993/main/assets";

const BOOK_FILES = [
  "book-patch/p000-0.txt",
  "book-patch/p000-1.txt",
  "book-patch/p000-2.txt",
  "book-text/part-001.txt",
  "book-text/part-002.txt",
  "book-text/part-003.txt",
  "book-text/part-004.txt",
  "book-patch/p005-0.txt",
  "book-patch/p005-1.txt",
  "book-patch/p005-2.txt",
  "book-patch/p006-0.txt",
  "book-patch/p006-1.txt",
  "book-patch/p006-2.txt",
  "book-patch/p007-0.txt",
] as const;

function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function loadBookPages() {
  const parts = await Promise.all(
    BOOK_FILES.map(async (file) => {
      const response = await fetch(`${RAW_BASE}/${file}`);
      if (!response.ok) throw new Error(`Book asset ${file}: ${response.status}`);
      return response.text();
    }),
  );

  const compressed = decodeBase64(parts.join("").trim());
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();
  const pages = JSON.parse(text) as string[];
  if (pages.length !== 106) throw new Error(`Expected 106 pages, received ${pages.length}`);
  return pages;
}

export function BookReader() {
  const [pages, setPages] = useState<string[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    loadBookPages()
      .then((data) => {
        if (active) setPages(data);
      })
      .catch((reason) => {
        console.error("Book loading failed", reason);
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
