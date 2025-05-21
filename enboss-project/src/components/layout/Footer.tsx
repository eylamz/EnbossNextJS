import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/server'

export default async function Footer({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng, 'common')
  
  return (
    <footer className="bg-gray-900 text-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Enboss</h3>
            <p className="text-gray-300">
              A comprehensive platform for skateparks in Israel, providing information about 
              skateparks, guides for various board sports, and an e-commerce shop.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lng}`} className="text-gray-300 hover:text-white">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${lng}/skateparks`} className="text-gray-300 hover:text-white">
                  {t('skateparks')}
                </Link>
              </li>
              <li>
                <Link href={`/${lng}/guides`} className="text-gray-300 hover:text-white">
                  {t('guides')}
                </Link>
              </li>
              <li>
                <Link href={`/${lng}/shop`} className="text-gray-300 hover:text-white">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link href={`/${lng}/contact`} className="text-gray-300 hover:text-white">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href={`/${lng}/about`} className="text-gray-300 hover:text-white">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('contact')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                Email: info@enboss.co
              </li>
              <li className="text-gray-300">
                {t('follow_us')}:
              </li>
              <li className="flex space-x-4 mt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Enboss. {t('all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  )
}