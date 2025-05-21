import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/server'

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const { t } = await useTranslation(locale, 'about')
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('about_enboss')}
        </h1>
        
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src="/images/about-hero.jpg" // You'll need to add this image to your public folder
            alt="Enboss Skateparks"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>{t('our_mission')}</h2>
          <p>{t('mission_text')}</p>
          
          <h2>{t('our_story')}</h2>
          <p>{t('story_text_1')}</p>
          <p>{t('story_text_2')}</p>
          
          <h2>{t('what_we_offer')}</h2>
          <ul>
            <li>{t('offer_1')}</li>
            <li>{t('offer_2')}</li>
            <li>{t('offer_3')}</li>
            <li>{t('offer_4')}</li>
          </ul>
          
          <h2>{t('our_team')}</h2>
          <p>{t('team_text')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/team-member-1.jpg" // You'll need to add this image to your public folder
                  alt="Team Member 1"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">John Doe</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('founder')}</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/team-member-2.jpg" // You'll need to add this image to your public folder
                  alt="Team Member 2"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Jane Smith</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('lead_developer')}</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/team-member-3.jpg" // You'll need to add this image to your public folder
                  alt="Team Member 3"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Mike Johnson</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('content_manager')}</p>
            </div>
          </div>
          
          <h2 className="mt-12">{t('join_community')}</h2>
          <p>{t('community_text')}</p>
        </div>
      </div>
    </div>
  )
}