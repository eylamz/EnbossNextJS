import { useTranslation } from '@/lib/i18n/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const { t } = await useTranslation(locale, 'admin')
  
  // This would typically check session/cookies for admin authentication
  // For now, we'll use a dummy check - in a real app, use middleware for this
  const isAdmin = true
  
  if (!isAdmin) {
    redirect(`/${locale}/login?redirect=admin`)
  }
  
  return (
    <div className="max-w-6xl mx-aut px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin_dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skateparks Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('skateparks_management')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('skateparks_management_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/skateparks`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('view_all_skateparks')}
            </Link>
            <Link
              href={`/${locale}/admin/skateparks/create`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
                {t('add_new_skatepark')}
            </Link>
          </div>
        </div>
        
        {/* Guides Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('guides_management')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('guides_management_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/guides`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('view_all_guides')}
            </Link>
            <Link
              href={`/${locale}/admin/guides/create`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              {t('add_new_guide')}
            </Link>
          </div>
        </div>
        
        {/* Products Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('products_management')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('products_management_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/products`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('view_all_products')}
            </Link>
            <Link
              href={`/${locale}/admin/products/create`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              {t('add_new_product')}
            </Link>
          </div>
        </div>
        
        {/* Orders Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('orders_management')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('orders_management_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/orders`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('view_all_orders')}
            </Link>
          </div>
        </div>
        
        {/* Users Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('users_management')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('users_management_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/users`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('view_all_users')}
            </Link>
          </div>
        </div>
        
        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('settings')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('settings_desc')}</p>
          <div className="flex flex-col space-y-2">
            <Link
              href={`/${locale}/admin/settings`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              {t('edit_settings')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}