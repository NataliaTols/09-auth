import css from "@/app/Home.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "Sorry, this page does not exist in NoteHub.",
  openGraph: {
    title: "Page not found | NoteHub",
    description: "Sorry, this page does not exist in NoteHub.",
    url: "https://notehub.com/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Page not found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </main>
  );
}