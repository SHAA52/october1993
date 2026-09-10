import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Уроки Великого Октября — Александр Шаравин",
    template: "%s — Уроки Великого Октября",
  },
  description: "Книга Александра Шаравина «Уроки Великого Октября». Октябрь 1993 года, воспоминания участников и невыученные уроки.",
  openGraph: {
    title: "Уроки Великого Октября — Александр Шаравин",
    description: "Онлайн-издание книги Александра Шаравина.",
    type: "book",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
