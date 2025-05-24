import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/server' // Ensure this path is correct
import { notFound } from 'next/navigation'
import { languages } from '@/lib/i18n/settings' // Ensure this path is correct
import dbConnect from '@/lib/mongodb' // Ensure this path is correct
import Skatepark from '@/models/Skatepark' // Ensure this path is correct
import Guide from '@/models/Guide' // Ensure this path is correct
import Product from '@/models/Product' // Ensure this path is correct

// Define a more specific type for Skatepark data used in the component
interface PageSkatepark {
  _id: string;
  slug: string;
  nameEn: string;
  nameHe?: string; // Optional if not always present
  addressEn: string;
  addressHe?: string; // Optional
  area: string;
  rating?: number; // Optional
  images?: Array<{ url: string; isFeatured?: boolean; orderNumber?: number }>; // More specific type for images
  // Add other fields from ISkatepark that you use directly in the template
}

interface PageGuide {
  _id: string;
  slug: string;
  titleEn: string;
  titleHe?: string;
  category: string;
  featuredImage?: string;
  tagsEn?: string[];
  tagsHe?: string[];
   // Add other fields
}

interface PageProduct {
  _id: string;
  slug: string;
  name: string;
  category: string;
  basePrice?: number;
  discount?: number;
  variants?: Array<{
    images?: string[];
    // Add other variant fields
  }>;
   // Add other fields
}


async function getFeaturedContent() {
  await dbConnect()
  
  // Using .lean() for performance and to get plain JS objects
  const skateparksData = await Skatepark.find({ 
    status: 'active',
    isFeatured: true 
  }).limit(4).lean();
  
  const guidesData = await Guide.find({ 
    status: 'active',
    isFeatured: true 
  }).limit(3).lean();
  
  const productsData = await Product.find({ 
    status: 'active',
    isFeatured: true 
  }).limit(4).lean();
  
  // Helper to convert Mongoose documents (even if lean) to ensure _id is a string
  const processDocs = (docs: any[]) => docs.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    // Ensure nested arrays like images also have their _id converted if they are subdocuments (not the case here for images array)
  }));

  return {
    skateparks: processDocs(skateparksData) as PageSkatepark[],
    guides: processDocs(guidesData) as PageGuide[],
    products: processDocs(productsData) as PageProduct[],
  }
}

export default async function Home({
  params
}: {
  params: { locale: string }
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  if (!languages.includes(locale)) {
    notFound()
  }
  
  const { t } = await useTranslation(locale, 'common')
  const { skateparks, guides, products } = await getFeaturedContent()
  
  return (
    <div className="max-w-screen mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${locale}/skateparks`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('explore_skateparks')}
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t('visit_shop')}
          </Link>
        </div>
      </section>
      
      {/* Featured Skateparks */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('featured_skateparks')}</h2>
          <Link
            href={`/${locale}/skateparks`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('view_all')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skateparks.map((park) => ( // park is now typed as PageSkatepark
            <Link
              key={park._id}
              href={`/${locale}/skateparks/${park.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                {/* CORRECTED: Check park.images[0].url and pass it to src */}
                {park.images && park.images.length > 0 && park.images[0] && park.images[0].url && park.images[0].url !== "" ? (
                  <Image
                    src={park.images[0].url} 
                    alt={locale === 'he' && park.nameHe ? park.nameHe : park.nameEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{locale === 'he' && park.nameHe ? park.nameHe : park.nameEn}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {/* Example: Displaying city from address (assuming address format "City, Rest of address") */}
                  {locale === 'he' && park.addressHe ? park.addressHe.split(',')[0].trim() : park.addressEn.split(',')[0].trim()}
                </p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    {t(park.area)}
                  </span>
                  {park.rating != null && park.rating > 0 && (
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
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Guides */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('featured_guides')}</h2>
          <Link
            href={`/${locale}/guides`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('view_all')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => ( // guide is now typed as PageGuide
            <Link
              key={guide._id}
              href={`/${locale}/guides/${guide.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                {guide.featuredImage && guide.featuredImage !== "" ? (
                  <Image
                    src={guide.featuredImage}
                    alt={locale === 'he' && guide.titleHe ? guide.titleHe : guide.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                  {t(guide.category)}
                </span>
                <h3 className="font-bold text-lg mt-2 mb-2">
                  {locale === 'he' && guide.titleHe ? guide.titleHe : guide.titleEn}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(locale === 'he' && guide.tagsHe ? guide.tagsHe : guide.tagsEn || []).slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('featured_products')}</h2>
          <Link
            href={`/${locale}/shop`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('view_all')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => ( // product is now typed as PageProduct
            <Link
              key={product._id}
              href={`/${locale}/shop/${product.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                {product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0 && product.variants[0].images[0] && product.variants[0].images[0] !== "" ? (
                  <Image
                    src={product.variants[0].images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {product.discount != null && product.basePrice != null ? (
                      <div className="flex items-center">
                        <span className="line-through text-red-500 text-sm">₪{product.basePrice.toFixed(0)}</span>
                        <span className="ml-2 font-bold">₪{(product.basePrice * (1 - product.discount / 100)).toFixed(0)}</span>
                      </div>
                    ) : (
                      product.basePrice != null && <span className="font-bold">₪{product.basePrice.toFixed(0)}</span>
                    )}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    {t(product.category)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
