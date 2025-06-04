import { useTranslation } from '@/lib/i18n/server'
import { notFound } from 'next/navigation'
import { languages } from '@/lib/i18n/settings'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'
import { BreadCrumbs } from '@/components/skatepark/BreadCrumbs'
import { ParkCardWrapper } from '@/components/skatepark/ParkCardWrapper'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { SearchableParks } from '@/components/skateparks/SearchableParks'
import React, { Suspense } from 'react'

type Props = {
  params: { locale: string }
}

interface SkateparkData {
  _id: string;
  nameEn: string;
  nameHe: string;
  slug: string;
  area: string;
  rating: number;
  ratingCount: number;
  images: Array<{ url: string; isFeatured?: boolean }>;
  amenities: Record<string, boolean>;
  openingYear: number;
  closingYear?: number;
  createdAt: Date;
  isFeatured: boolean;
}

// Loading component for the page
function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size={48} />
    </div>
  );
}

// Loading component for sections
function SectionLoading() {
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <LoadingSpinner size={32} />
    </div>
  );
}

async function getSkateparks() {
  await dbConnect()
  
  const skateparks = await Skatepark.find({})
    .sort({ isFeatured: -1, rating: -1 }) // Sort by featured first, then by rating
  
  return JSON.parse(JSON.stringify(skateparks))
}

// Add metadata generation function
export async function generateMetadata({ params: { locale } }: Props) {
  const { t } = await useTranslation(locale, 'skateparks')
  
  // Get skateparks for structured data
  const skateparks = await getSkateparks()
  
  // Construct meta description
  const metaDescription = t('metaDescription.list', {
    count: skateparks.length,
    default: `Discover ${skateparks.length} skateparks across Israel. Find detailed information about each park including amenities, opening hours, and ratings.`
  })
  
  // Construct canonical URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://enboss.com'
  const canonicalUrl = `${baseUrl}/${locale}/skateparks`
  
  // Prepare alternate language URLs
  const alternateLanguages = languages.reduce((acc, lang) => ({
    ...acc,
    [lang]: `${baseUrl}/${lang}/skateparks`
  }), {})
  
  // Prepare structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": skateparks.map((park: SkateparkData, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SportsActivityLocation",
        "name": locale === 'he' ? park.nameHe : park.nameEn,
        "area": park.area,
        "image": park.images?.map((img: { url: string }) => img.url) || [],
        "dateOpened": park.openingYear,
        ...(park.closingYear && { "dateClosed": park.closingYear }),
        ...(park.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": park.rating,
            "ratingCount": park.ratingCount,
            "bestRating": "5",
            "worstRating": "1"
          }
        })
      }
    }))
  }
  
  return {
    metadataBase: new URL(baseUrl),
    title: `${t('metaTitle', { default: 'Skateparks' })} | ENBOSS`,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${t('metaTitle', { default: 'Skateparks' })} | ENBOSS`,
      description: metaDescription,
      siteName: 'ENBOSS'
    },
    twitter: {
      card: 'summary',
      title: `${t('metaTitle', { default: 'Skateparks' })} | ENBOSS`,
      description: metaDescription,
      site: '@enboss'
    }
  }
}

export default async function SkateparksPage({ params: { locale } }: Props) {
  // Check if the locale is supported
  if (!languages.includes(locale)) {
    notFound()
  }
  
  const { t } = await useTranslation(locale, 'skateparks')
  
  // Get skateparks
  const skateparks = await getSkateparks()

  return (
    <Suspense fallback={<PageLoading />}>
      <div className="min-h-screen relative">
        <div className="container mx-auto px-4 py-8 relative">
          
          <div className="max-w-6xl w-full mx-auto py-[70px] md:py-20">
            <SearchableParks skateparks={skateparks} locale={locale} />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
