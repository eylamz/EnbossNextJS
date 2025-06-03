import type { Metadata } from "next";
import { Inter, Poppins, Arimo } from "next/font/google";
import "./globals.css";
import { dir } from 'i18next';
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const arimo = Arimo({
  subsets: ["hebrew", "latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arimo',
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
    <html lang={params.locale} dir={direction} className={`${poppins.variable} ${arimo.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error setting theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`flex flex-col min-h-screen bg-background dark:bg-background-dark dark:text-white ${params.locale === 'he' ? 'font-arimo' : 'font-poppins'}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
