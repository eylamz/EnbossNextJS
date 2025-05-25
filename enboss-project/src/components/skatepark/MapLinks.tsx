'use client'

import { motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { Icon } from '@/assets/icons'
import { useTheme } from '@/context/ThemeProvider'
import { useTranslation } from '@/lib/i18n/client'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { useEffect, useState } from 'react'

interface MapLinksProps {
  mediaLinks?: {
    googleMapsUrl?: string;
    appleMapsUrl?: string;
    wazeUrl?: string;
  };
  parkName: string;
}

export function MapLinks({ mediaLinks, parkName }: MapLinksProps) {
  const { theme } = useTheme()
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const locale = String(params.locale)
  const { t } = useTranslation(locale, 'skateparks')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!mediaLinks?.googleMapsUrl && !mediaLinks?.appleMapsUrl && !mediaLinks?.wazeUrl) {
    return null
  }

  return (
    <section 
      aria-labelledby="directions-heading"
      key={`map-links-${locale}-${mounted}`}
    >
      <h2 id="directions-heading" className="sr-only">{t('mapLinks.title')}</h2>
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-text dark:text-[#96b6c9] mb-2">
            {t('mapLinks.title')}
          </h3>

          <div className="flex flex-wrap justify-center gap-6 items-center">
            {/* Waze Map Link with Tooltip */}
            {mediaLinks?.wazeUrl && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.a 
                      href={mediaLinks.wazeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${t('mapLinks.wazeLink')} ${parkName}`}
                      className="sm:p-3 rounded-xl sm:bg-background/30 sm:dark:bg-background-secondary/5 flex items-center justify-center"
                      variants={{
                        initial: { scale: 1 },
                        hover: { 
                          scale: 1.15,
                          transition: { 
                            type: "spring", 
                            stiffness: 500,
                            damping: 8,
                            duration: 0.01
                          }
                        },
                      }}
                      initial="initial"
                      whileHover="hover"
                    >
                      <Icon 
                        name={theme === 'dark' ? "wazeDark" : "wazeBold"} 
                        category="action" 
                        className="w-[3.15rem] h-[3.15rem] -mt-[2px] sm:w-[2.65rem] sm:h-[2.65rem] text-[#1acdff] dark:text-text-dark drop-shadow-md dark:drop-shadow-lg overflow-visible"
                      />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-center">
                    {t('mapLinks.wazeLink')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Google Maps Link with Tooltip */}
            {mediaLinks?.googleMapsUrl && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.a 
                      href={mediaLinks.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${t('mapLinks.googleLink')} ${parkName}`}
                      className="sm:p-3 rounded-xl sm:bg-background/30 sm:dark:bg-background-secondary/5 flex items-center justify-center"
                      variants={{
                        initial: { scale: 1 },
                        hover: { 
                          scale: 1.15,
                          transition: { 
                            type: "spring", 
                            stiffness: 500,
                            damping: 8,
                            duration: 0.01
                          }
                        },
                      }}
                      initial="initial"
                      whileHover="hover"
                    >
                      <Icon 
                        name="newGoogleMaps" 
                        category="action" 
                        className="w-[3.15rem] h-[3.15rem] -mt-[2px] sm:w-[2.65rem] sm:h-[2.65rem] text-text-dark dark:text-text drop-shadow-md dark:drop-shadow-lg overflow-visible"
                      />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-center">
                    {t('mapLinks.googleLink')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Apple Maps Link with Tooltip */}
            {mediaLinks?.appleMapsUrl && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.a 
                      href={mediaLinks.appleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${t('mapLinks.appleLink')} ${parkName}`}
                      className="sm:p-3 rounded-xl sm:bg-background/30 sm:dark:bg-background-secondary/5 flex items-center justify-center"
                      variants={{
                        initial: { scale: 1 },
                        hover: { 
                          scale: 1.15,
                          transition: { 
                            type: "spring", 
                            stiffness: 500,
                            damping: 8,
                            duration: 0.05
                          }
                        },
                        tap: { 
                          scale: 0.95,
                          transition: { 
                            duration: 0.08
                          }
                        }
                      }}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Icon 
                        name={theme === 'dark' ? "newAppleMapsDark" : "newAppleMaps"} 
                        category="action" 
                        className="w-12 h-12 sm:w-10 sm:h-10 text-[#3a3a3a] dark:text-text-secondary-dark drop-shadow-md dark:drop-shadow-lg overflow-visible"
                      />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-center">
                    {t('mapLinks.appleLink')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
    </section>
  )
} 