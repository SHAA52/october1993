"use client";

import { useEffect, useMemo, useState } from "react";

const FIRST_PAGE = 2;
const LAST_PAGE = 106;

export function BookReader() {
  const pages = useMemo(() => Array.from({ length: LAST_PAGE - FIRST_PAGE + 1 }, (_, i) => i + FIRST_PAGE), []);
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [width, setWidth] = useState<"compact" | "normal" | "wide">("normal");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-book-page]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrentPage(Number((visible.target as HTMLElement).dataset.bookPage));
      },
      { threshold: [0.15, 0.35, 0.6] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const progress = ((currentPage - FIRST_PAGE + 1) / pages.length) * 100;

  return (
    <section className="reader-shell" aria-label="Текст книги в печатной верстке">
      <div className="reader-toolbar">
        <div className="reader-page">Страница {currentPage} / {LAST_PAGE}</div>
        <div className="reader-width" aria-label="Ширина страницы">
          <button aria-label="Уменьшить ширину страницы" onClick={() => setWidth("compact")} aria-pressed={width === "compact"}>−</button>
          <button aria-label="Обычная ширина страницы" onClick={() => setWidth("normal")} aria-pressed={width === "normal"}>○</button>
          <button aria-label="Увеличить ширину страницы" onClick={() => setWidth("wide")} aria-pressed={width === "wide"}>＋</button>
        </div>
      </div>
      <div className="reader-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className={`book-pages book-pages--${width}`}>
        {pages.map((page) => (
          <figure id={`page-${page}`} key={page} className="book-page" data-book-page={page}>
            <img
              src={`/book-pages/page-${String(page).padStart(3, "0")}.webp`}
              alt={`Страница ${page} книги «Уроки Великого Октября»`}
              loading={page <= 3 ? "eager" : "lazy"}
              decoding="async"
              width="998"
              height="1418"
            />
            <figcaption>Страница {page}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
