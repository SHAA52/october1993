import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { BookReader } from "../../components/BookReader";
import { reviews, dobrokhotovPreface } from "../../content/site";

export const metadata: Metadata = { title: "Книга" };

export default function BookPage() {
  return (
    <main className="book-page-route">
      <SiteHeader current="book" />

      <section className="editorial-section voices-section">
        <p className="section-kicker">Перед чтением</p>
        <h1>О книге говорят</h1>
        <div className="voices-grid">
          {reviews.map((item) => (
            <blockquote key={item.author} className="voice-card">
              <p>{item.quote}</p>
              <footer>— {item.author}</footer>
            </blockquote>
          ))}
        </div>
        <a className="text-link" href="#book-text">Перейти к книге ↓</a>
      </section>

      <section id="book-text" className="book-heading">
        <p className="section-kicker">Александр Шаравин</p>
        <h2>Уроки Великого Октября</h2>
      </section>

      <BookReader />

      <section className="afterword editorial-section">
        <p className="section-kicker">После основного текста</p>
        <h2>{dobrokhotovPreface.title}</h2>
        <p className="publication-note">{dobrokhotovPreface.note}</p>
        <div className="prose">
          {dobrokhotovPreface.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <p className="signature">{dobrokhotovPreface.author}</p>
        </div>
      </section>

      <section className="next-section">
        <span>Далее</span>
        <Link href="/author">Об авторе <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
