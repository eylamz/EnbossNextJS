import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/server'
import { notFound } from 'next/navigation'
import { languages } from '@/lib/i18n/settings'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'
import ImageSlider from '@/components/skatepark/imageSlider'
import React from 'react'

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
  
  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Blurred Background Image */}
      {skatepark.images && skatepark.images.length > 0 && (
        <div 
          className="fixed inset-0 z-[-1] bg-no-repeat w-[102%] h-[102%] -mt-2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getFeaturedImage(skatepark.images)})`,
            filter: 'blur(5px) saturate(2)',
            WebkitFilter: 'blur(5px) saturate(2)',
          }}
        >
          {/* Overlay to further reduce contrast and improve readability */}
          <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/50"></div>
        </div>
      )}

      <div className="container mx-auto py-8 px-4 py-[110px] md:py-24 overflow-visible">
        <div>
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="mb-2 md:mb-6">
              {/* Mobile version with line breaks (hidden on sm and above) */}
              <h1 className="text-4xl font-bold text-center text-text-dark sm:hidden">
                {parkName.includes('-') ? 
                  parkName.split('-').map((part, index, array) => (
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

            {/* Back button */}
            <div className="mb-6">
              <a
                href={`/${locale}/skateparks`}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t('back_to_skateparks')}
              </a>
            </div>

            {/* Skatepark header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{skatepark.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{skatepark.city}</p>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                    {t(skatepark.area)}
                  </span>
                  {skatepark.status === 'inactive' && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded">
                      {t('inactive')}
                    </span>
                  )}
                  {skatepark.rating > 0 && (
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-sm">{skatepark.rating.toFixed(1)}</span>
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        ({skatepark.ratingCount || 0})
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                {skatepark.mediaLinks?.wazeUrl && (
                  <a
                    href={skatepark.mediaLinks.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.432 11.511c-.04-.942-.435-1.754-1.134-2.458-.818-.823-1.743-1.232-2.75-1.232-1.021 0-1.994.396-2.929 1.19-.934-.794-1.906-1.19-2.929-1.19-1.007 0-1.932.409-2.75 1.232-.699.704-1.094 1.516-1.134 2.458-.044 1.017.252 1.97.879 2.855.916 1.29 2.383 2.606 3.925 3.929l.164.125c.372.282.603.458.82.438.217.02.449-.156.82-.438l.165-.125c1.542-1.323 3.008-2.639 3.925-3.929.626-.885.922-1.838.879-2.855z"/>
                    </svg>
                    {t('navigate_waze')}
                  </a>
                )}
                
                {skatepark.mediaLinks?.googleMapsUrl && (
                  <a
                    href={skatepark.mediaLinks.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003z"/>
                    </svg>
                    {t('navigate_google')}
                  </a>
                )}
                
                {skatepark.mediaLinks?.appleMapsUrl && (
                  <a
                    href={skatepark.mediaLinks.appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0C7.802 0 4 3.403 4 7.602C4 9.604 4.601 11.205 5.803 13.406L6.203 14.008L12 24L17.797 14.008L18.197 13.406C19.399 11.205 20 9.604 20 7.602C20 3.403 16.198 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
                    </svg>
                    {t('navigate_apple')}
                  </a>
                )}
              </div>
            </div>
            
            {/* Skatepark images */}
            {skatepark.images && skatepark.images.length > 0 && (
              <div className="mb-10">
                <ImageSlider images={skatepark.images} />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Opening Hours */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('opening_hours')}</h2>
                <ul className="space-y-2">
                  {skatepark.openingHours && skatepark.openingHours.map((hours: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{hours.days}</span>
                      <span className="font-medium">{hours.hours}</span>
                    </li>
                  ))}
                </ul>
                
                {skatepark.lightingHours && skatepark.lightingHours.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold mt-6 mb-3">{t('lighting_hours')}</h3>
                    <ul className="space-y-2">
                      {skatepark.lightingHours.map((hours: any, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">{hours.days}</span>
                          <span className="font-medium">{hours.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              {/* Features */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('features')}</h2>
                {skatepark.features && skatepark.features.length > 0 ? (
                  <ul className="space-y-2">
                    {skatepark.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{t('no_features_listed')}</p>
                )}
              </div>
              
              {/* Info */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('information')}</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-300 w-32">{t('address')}:</span>
                    <span className="font-medium">{skatepark.address}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-300 w-32">{t('opening_year')}:</span>
                    <span className="font-medium">{skatepark.openingYear}</span>
                  </li>
                  {skatepark.closingYear && (
                    <li className="flex items-start">
                      <span className="text-gray-600 dark:text-gray-300 w-32">{t('closing_year')}:</span>
                      <span className="font-medium">{skatepark.closingYear}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Google Maps iFrame */}
            {skatepark.mediaLinks?.googleMapsFrame && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">{t('location')}</h2>
                <div className="w-full h-96 rounded-lg overflow-hidden">
                  <iframe
                    src={skatepark.mediaLinks.googleMapsFrame}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {skatepark.notes && (
              <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('notes')}</h2>
                <p className="text-gray-700 dark:text-gray-300">{skatepark.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}