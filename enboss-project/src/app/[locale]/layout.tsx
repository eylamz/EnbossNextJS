import { dir } from 'i18next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css' // Ensure this path is correct
import { languages } from '@/lib/i18n/settings' // Ensure this path is correct
import { ReactNode } from 'react'
import Header from '@/components/layout/Header' // Ensure this path is correct
import Footer from '@/components/layout/Footer' // Ensure this path is correct
import { ThemeProvider } from '@/context/ThemeProvider' // Ensure this path is correct
import { ErrorProvider } from '@/context/ErrorContext'
import { notFound } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return languages.map((lang) => ({ locale: lang })) // Changed 'locale' to 'lang' here to avoid confusion if 'locale' is used elsewhere in this function's scope
}

export const metadata: Metadata = {
  title: 'Enboss - Skatepark Directory & Shop',
  description: 'A comprehensive platform for skateparks in Israel',
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const direction = locale === 'he' ? 'rtl' : 'ltr';
  
  if (!languages.includes(locale)) {
    notFound()
  }

  // Get the metadata from the current page
  const metadata = await import('next/headers').then(mod => mod.headers().get('x-next-metadata'))
  const isClosed = metadata ? JSON.parse(metadata).other?.isClosed : false

  return (
    <ThemeProvider>
      <ErrorProvider>
        <div dir={direction}>
          <Header lng={locale} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer lng={locale} />
        </div>
      </ErrorProvider>
    </ThemeProvider>
  )
}
