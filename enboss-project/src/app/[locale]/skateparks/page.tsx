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
          
          <div className="max-w-6xl w-full mx-auto py-[70px] md:py-24">
            <SearchableParks skateparks={skateparks} locale={locale} />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
