import Link from "next/link";

export function SiteHeader({ current }: { current?: "cover" | "book" | "author" }) {
  return (
    <header className="site-header">
      <Link className="site-mark" href="/" aria-label="На обложку">OCTOBER1993</Link>
      <nav aria-label="Основная навигация">
        <Link className={current === "cover" ? "active" : ""} href="/">Обложка</Link>
        <Link className={current === "book" ? "active" : ""} href="/book">Книга</Link>
        <Link className={current === "author" ? "active" : ""} href="/author">Автор</Link>
      </nav>
    </header>
  );
}
