import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { ChunkedImage } from "../components/ChunkedImage";

export default function CoverPage() {
  return (
    <main className="cover-page">
      <SiteHeader current="cover" />
      <section className="cover-hero">
        <div className="cover-image-wrap">
          <ChunkedImage
            asset="cover-small"
            parts={2}
            alt="Обложка книги Александра Шаравина «Уроки Великого Октября»"
            className="cover-image"
          />
        </div>
        <div className="cover-copy">
          <p className="eyebrow">Александр Шаравин</p>
          <h1>Уроки<br />Великого Октября</h1>
          <Link className="primary-link" href="/book">Читать книгу <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
