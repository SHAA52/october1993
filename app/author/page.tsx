import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { ChunkedImage } from "../../components/ChunkedImage";
import { authorBio } from "../../content/site";

export const metadata: Metadata = { title: "Автор" };

export default function AuthorPage() {
  return (
    <main className="author-page">
      <SiteHeader current="author" />
      <section className="author-layout">
        <div className="author-photo-wrap">
          <ChunkedImage
            asset="author-small"
            parts={1}
            alt="Александр Александрович Шаравин"
            className="author-photo"
          />
        </div>
        <article className="author-copy">
          <p className="section-kicker">Автор</p>
          <h1>{authorBio.name}</h1>
          <div className="prose">
            {authorBio.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <a className="facebook-link" href={authorBio.facebook} target="_blank" rel="noreferrer">Facebook <span aria-hidden="true">↗</span></a>
        </article>
      </section>
      <section className="next-section">
        <span>Вернуться</span>
        <Link href="/">На обложку <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
