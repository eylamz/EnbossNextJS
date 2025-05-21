'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import Link from 'next/link'

export default function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  const { t } = useTranslation(locale, 'profile')
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile')
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.push(`/${locale}/login?redirect=profile`)
            return
          }
          throw new Error('Failed to fetch user data')
        }
        
        const data = await response.json()
        setUser(data.user)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [locale, router])
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push(`/${locale}/login`)
      }
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }
  
  if (!user) return null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('my_profile')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-600 dark:text-gray-300">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/profile`}
                    className="block px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium"
                  >
                    {t('my_profile')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/profile/orders`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('my_orders')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/profile/favorites`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('my_favorites')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/profile/addresses`}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t('my_addresses')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">{t('account_details')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('name')}</h3>
                <p className="mt-1">{user.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('email')}</h3>
                <p className="mt-1">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member_since')}</h3>
                <p className="mt-1">
                  {new Date(user.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="pt-4">
                <Link
                  href={`/${locale}/profile/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {t('edit_profile')}
                </Link>
              </div>
            </div>
            
            <hr className="my-8 border-gray-200 dark:border-gray-700" />
            
            <h2 className="text-xl font-semibold mb-6">{t('preferences')}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('language')}</h3>
                <p className="mt-1">
                  {locale === 'he' ? 'עברית' : 'English'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('theme')}</h3>
                <p className="mt-1">
                  {user.preferences?.theme === 'dark' ? t('dark_mode') : t('light_mode')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}