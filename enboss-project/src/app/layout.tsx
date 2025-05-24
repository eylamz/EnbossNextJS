import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { dir } from 'i18next';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-hebrew',
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
  const direction = params.locale === 'he' ? 'rtl' : 'ltr';
  
  return (
    <html lang={params.locale} dir={direction} className={`${poppins.variable} ${notoSansHebrew.variable}`}>
      <body className={`flex flex-col min-h-screen bg-background dark:bg-background-dark dark:text-white ${params.locale === 'he' ? 'font-noto-hebrew' : 'font-poppins'}`}>
        {children}
      </body>
    </html>
  );
}
