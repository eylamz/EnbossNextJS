import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/server'
import { notFound } from 'next/navigation'
import { languages } from '@/lib/i18n/settings'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'

type Props = {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getSkateparks(area: string | null, status: string = 'active') {
  await dbConnect()
  
  const query: any = {
    status: status === 'all' ? { $in: ['active', 'inactive'] } : status,
  }
  
  if (area) {
    query.area = area
  }
  
  const skateparks = await Skatepark.find(query).sort({ name: 1 })
  
  return JSON.parse(JSON.stringify(skateparks))
}

export default async function SkateparksPage({ params: { locale }, searchParams }: Props) {
  // Check if the locale is supported
  if (!languages.includes(locale)) {
    notFound()
  }
  
  const { t } = await useTranslation(locale, 'skateparks')
  
  // Get filter parameters
  const area = typeof searchParams.area === 'string' ? searchParams.area : null
  const status = typeof searchParams.status === 'string' ? searchParams.status : 'active'
  
  // Get skateparks
  const skateparks = await getSkateparks(area, status)
  
  return (
    <div className="w-full container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t('all_skateparks')}</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('filter_by_area')}
            </label>
            <select
              id="area-filter"
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={area || ''}
              onChange={(e) => {
                const url = new URL(window.location.href)
                if (e.target.value) {
                  url.searchParams.set('area', e.target.value)
                } else {
                  url.searchParams.delete('area')
                }
                window.location.href = url.toString()
              }}
            >
              <option value="">{t('all_areas')}</option>
              <option value="north">{t('north')}</option>
              <option value="center">{t('center')}</option>
              <option value="south">{t('south')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Skateparks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skateparks.map((park: any) => (
          <Link
            key={park._id}
            href={`/${locale}/skateparks/${park.slug}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              {park.images && park.images.length > 0 ? (
                <Image
                  src={park.images[0]}
                  alt={park.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{park.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{park.city}</p>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                  {t(park.area)}
                </span>
                {park.rating > 0 && (
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 text-sm">{park.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {park.status === 'inactive' && (
                <div className="mt-2 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded inline-block">
                  {t('inactive')}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {skateparks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('no_skateparks_found')}
          </p>
        </div>
      )}
    </div>
  )
}