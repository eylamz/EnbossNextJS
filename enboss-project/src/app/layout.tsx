import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dir } from 'i18next';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enboss - Skatepark Directory & Shop",
  description: "A comprehensive platform for skateparks in Israel",
};

export default function RootLayout({
  children,
  params = { locale: 'en' }
}: {
  children: React.ReactNode;
  params?: { locale: string };
}) {
  return (
    <html lang={params.locale} dir={dir(params.locale)}>
      <body className={`${inter.className} flex flex-col min-h-screen dark:bg-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
