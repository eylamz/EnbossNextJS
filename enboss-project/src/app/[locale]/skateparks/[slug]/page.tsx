import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/server'
import { notFound } from 'next/navigation'
import { languages } from '@/lib/i18n/settings'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'
import ImageSlider from '@/components/skatepark/imageSlider'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/assets/icons'
import FormattedHours from '@/components/skatepark/FormattedHours'
import { AmenitiesGrid } from '@/components/skatepark/AmenitiesGrid'
import { ShareButton } from '@/components/skatepark/ShareButton'
import { BreadCrumbs } from '@/components/skatepark/BreadCrumbs'
import { MapLinks } from '@/components/skatepark/MapLinks'
import { YouTubeVideo } from '@/components/skatepark/YouTubeVideo'
import RelatedParks from '@/components/skatepark/RelatedParks'
import HeartRating from '@/components/skatepark/HeartRating'
import React from 'react'
import Script from 'next/script'
import ErrorStateHandler from '@/components/skatepark/ErrorStateHandler'
import { updateRating } from '@/app/actions/rating'
import { RatingCard } from '@/components/skatepark/RatingCard'

interface SkateparkImage {
  url: string;
  isFeatured?: boolean;
}

type Props = {
  params: { locale: string; slug: string }
}

// Helper function to get featured image
function getFeaturedImage(images: any[]) {
  if (!images || images.length === 0) return null
  const featured = images.find(img => img.isFeatured)
  return featured ? featured.url : images[0].url
}

async function getSkatepark(slug: string) {
  await dbConnect()
  
  const skatepark = await Skatepark.findOne({ slug })
  
  if (!skatepark) {
    return null
  }
  
  return JSON.parse(JSON.stringify(skatepark))
}

async function getRelatedParks(currentParkId: string, area: string) {
  await dbConnect()
  
  // First try to get parks from the same area
  const sameAreaParks = await Skatepark.find({ 
    _id: { $ne: currentParkId },
    area: area 
  }).limit(4)
  
  // If we have 4 parks from the same area, return them
  if (sameAreaParks.length >= 4) {
    return JSON.parse(JSON.stringify(sameAreaParks))
  }
  
  // If we need more parks, get them from other areas
  const otherAreaParks = await Skatepark.find({ 
    _id: { $ne: currentParkId },
    area: { $ne: area }
  }).limit(4 - sameAreaParks.length)
  
  // Combine and return the parks
  const allParks = [...sameAreaParks, ...otherAreaParks]
  return JSON.parse(JSON.stringify(allParks))
}

// Add this before the SkateparkPage component
export async function generateMetadata({ params: { locale, slug } }: Props) {
  const skatepark = await getSkatepark(slug)
  
  return {
    other: {
      isClosed: !!skatepark?.closingYear
    }
  }
}

export default async function SkateparkPage({ params: { locale, slug } }: Props) {
  
  // Check if the locale is supported
  if (!languages.includes(locale)) {
    notFound()
  }
  
  const { t } = await useTranslation(locale, 'skateparks')
  
  // Get skatepark
  const skatepark = await getSkatepark(slug)
  
  if (!skatepark) {
    notFound()
  }

  // Get the appropriate park name based on locale
  const parkName = locale === 'he' ? skatepark.nameHe : skatepark.nameEn
  const parkAddress = locale === 'he' ? skatepark.addressHe : skatepark.addressEn
  const parkNotes = locale === 'he' ? skatepark.notesHe : skatepark.notesEn
  
  // Prepare structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": parkName,
    "description": parkNotes,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": parkAddress
    },
    "openingHours": skatepark.operatingHours,
    "amenityFeature": Object.entries(skatepark.amenities)
      .filter(([_, available]) => available)
      .map(([amenity]) => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      })),
    "image": skatepark.images?.map((img: SkateparkImage) => img.url) || [],
    "dateOpened": skatepark.openingYear,
    ...(skatepark.closingYear && { "dateClosed": skatepark.closingYear })
  };

  // Get related parks
  const relatedParks = await getRelatedParks(skatepark._id, skatepark.area)

  return (
    <div className="min-h-screen relative">
      <ErrorStateHandler isClosed={!!skatepark.closingYear} />
      {/* Add structured data */}
      <Script
        id="skatepark-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Blurred Background Image */}
      {skatepark.images && skatepark.images.length > 0 && (
        <div 
          className="fixed inset-0 z-[-1] bg-no-repeat bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${getFeaturedImage(skatepark.images)})`,
            filter: 'blur(5px) saturate(2)',
            WebkitFilter: 'blur(5px) saturate(2)',
            transform: 'scale(1.02)', // Prevent blur edges
          }}
        >
          {/* Overlay to further reduce contrast and improve readability */}
          <div className="absolute inset-0 bg-background-dark/30 dark:bg-background-dark/50"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumbs */}
        <BreadCrumbs
          previousPage={{
            path: '/skateparks',
            label: 'skateparks'
          }}
          currentPage={{
            label: parkName
          }}
          locale={locale}
        />
        
        <div className="max-w-6xl w-full mx-auto py-[70px] md:py-24">
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="mb-2 md:mb-6">
              {/* Mobile version with line breaks (hidden on sm and above) */}
              <h1 className="text-4xl font-bold text-center text-text-dark sm:hidden">
                {parkName.includes('-') ? 
                  parkName.split('-').map((part: string, index: number, array: string[]) => (
                    <React.Fragment key={index}>
                      {part.trim()}
                      {index < array.length - 1 && <br />}
                    </React.Fragment>
                  ))
                  : parkName
                }
              </h1>
              
              {/* Desktop version without line breaks (hidden on xs, visible on sm and above) */}
              <h1 className="hidden sm:block text-4xl font-bold text-center text-text-dark">
                {parkName}
              </h1>
            </div>

            {/* Skatepark images */}
            {skatepark.images && skatepark.images.length > 0 && (
              <div className="mt-2 mb-8">
                <ImageSlider images={skatepark.images} />
              </div>
            )}

            {/* Info Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Hours Card */}
              <Card className="text-text dark:text-[#7991a0] p-4 backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/80 transform-gpu">
                <div className="flex gap-4 mb-4 justify-between">
                  <div className="">
                    <FormattedHours 
                      key={locale}
                      operatingHours={skatepark.operatingHours}
                      lightingHours={skatepark.lightingHours}
                      closingYear={skatepark.closingYear}
                      locale={locale}
                    />
                  </div>
                  <div>
                    <ShareButton
                      parkName={parkName}
                      area={skatepark.area}
                      closingYear={skatepark.closingYear}
                      locale={locale}
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-6 pt-4 border-t border-border-dark/20 dark:border-text-secondary-dark/70 dark:text-[#7991a0]">
                  <div className="flex items-center mb-3">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Icon name="locationBold" category="navigation" className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      {t('address')} 
                    </h2>
                  </div>

                  <div className="flex flex-col px-7 gap-2 mb-2">
                    <span itemProp="address">{parkAddress}</span>
                  </div>
                </div>

                {/* Opening/Closing Year Section */}
                <div className="mt-6 pt-4 px-7 border-t border-border-dark/20 dark:border-text-secondary-dark/30 dark:text-[#7991a0]">
                  <div className="flex flex-col flex-wrap gap-2 mb-2">
                    <span>{t('opened_at')} {skatepark.openingYear}.</span>
                    {skatepark.closingYear && (
                      <span className='text-error dark:text-error/80'>{t('closed_at')} {skatepark.closingYear}.</span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Amenities Card */}
              <Card className="p-4 backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 transform-gpu">
                <div className="flex items-center justify-between mb-3 text-text dark:text-[#7991a0]">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Icon name="amenitiesBold" category="ui" className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                    {t('amenities.title')}
                  </h2>
                </div>
                
                {/* Amenities grid */}
                <AmenitiesGrid 
                  amenities={skatepark.amenities}
                  closingYear={skatepark.closingYear}
                  amenityOrder={Object.keys(skatepark.amenities)}
                  locale={locale}
                />

                {/* Notes Section */}
                {parkNotes && (
                  <div className="mt-3 pt-3 border-t border-border-dark/20 dark:border-text-secondary-dark/70 text-text dark:text-[#7991a0]">
                    <div className="flex items-center mb-2">
                      <Icon name="infoBold" category="ui" className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                      <h3 className="text-lg font-semibold">{t('notes')}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {Array.isArray(parkNotes) ? (
                        parkNotes.map((note, index) => (
                          <div key={index} className="bg-gray-50/40 w-fit dark:bg-gray-400/[7.5%] px-2.5 py-1.5 rounded-md text-text dark:text-text-dark/80">
                            <div className="text-sm">
                              • {note}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50/40 w-fit dark:bg-gray-400/[7.5%] px-2.5 py-1.5 rounded-md text-text dark:text-text-dark/80">
                          <div className="text-sm">
                            • {parkNotes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Map Links Card */}
            {(skatepark.mediaLinks?.googleMapsUrl || 
              skatepark.mediaLinks?.appleMapsUrl || 
              skatepark.mediaLinks?.wazeUrl) && (
              <div className="w-full mx-auto mb-8">
                <Card className="w-full p-4 backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 transform-gpu">
                  <MapLinks 
                    mediaLinks={skatepark.mediaLinks}
                    parkName={parkName}
                  />
                </Card>
              </div>
            )}

            {/* Rating Card */}
            <RatingCard
              skateparkId={skatepark._id}
              rating={skatepark.rating || 0}
              totalVotes={skatepark.totalVotes || 0}
              isClosed={!!skatepark.closingYear}
              title={t('rating.title')}
            />

            {/* YouTube Video Card */}
            {skatepark.mediaLinks?.youtubeUrl && (
              <YouTubeVideo 
                youtubeUrl={skatepark.mediaLinks.youtubeUrl}
                parkName={parkName}
              />
            )}
          </div>
        </div>

        {/* Related Skateparks Section */}
        <section aria-labelledby="related-parks-heading" className="w-full max-w-6xl mx-auto mt-8">
          <h2 id="related-parks-heading" className="sr-only">{t('relatedParks')}</h2>
          <RelatedParks 
            currentParkId={skatepark._id} 
            area={skatepark.area}
            relatedParks={relatedParks}
            locale={locale}
          />
        </section>
      </div>
    </div>
  )
}