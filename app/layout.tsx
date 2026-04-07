import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Roboto } from 'next/font/google';


const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});



export const metadata: Metadata = {
  title: "NoteHub",
  description: "Create your Note with NoteHub",
   openGraph: {
    title: "NoteHub",
    description: "Create and manage your notes easily with NoteHub",
    url: "https://notehub.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub preview",
      },
    ],
  },
};

export default function RootLayout({
  children, modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
     <html lang="en" className={`${roboto.variable}`}>
      <body className={`${roboto.variable} `}>
        <TanStackProvider>
          <Header></Header>
          {children}
          {modal}

          <Footer></Footer>
        </TanStackProvider>
      </body>
    </html>
  );
}
