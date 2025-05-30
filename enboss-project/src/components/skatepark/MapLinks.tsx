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
  parkName: string;
  nameHe: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export function MapLinks({ parkName, nameHe, location }: MapLinksProps) {
  const { theme } = useTheme()
  const params = useParams()
  const router = useRouter()
  const locale = String(params.locale)
  const { t } = useTranslation(locale, 'skateparks')

  const generateMoovitUrl = (): string => {
    const baseUrl = 'https://moovit.onelink.me/3986059930';
    const encodedParkName = encodeURIComponent(`סקייטפארק ${nameHe}`);
    const tll = `${location.latitude}_${location.longitude}`;
    return `${baseUrl}?to=${encodedParkName}&tll=${tll}&lang=${locale}`;
  };

  const generateWazeUrl = (): string => {
    const baseUrl = 'https://waze.com/ul';
    const params = `ll=${location.latitude},${location.longitude}&navigate=yes&q=${encodeURIComponent(`סקייטפארק ${nameHe}`)}`;
    return `${baseUrl}?${params}`;
  };

  const generateAppleMapsUrl = (): string => {
    const baseUrl = 'https://maps.apple.com/';
    const params = `?ll=${location.latitude},${location.longitude}&q=${encodeURIComponent(`סקייטפארק ${nameHe}`)}`;
    return `${baseUrl}${params}`;
  };

  const generateGoogleMapsUrl = (): string => {
    const baseUrl = 'https://www.google.com/maps/dir/';
    const destination = `${location.latitude},${location.longitude}`;
    return `${baseUrl}?api=1&destination=${destination}`;
  };

  return (
    <section 
      aria-labelledby="directions-heading"
      key={`map-links-${locale}`}
    >
      <h2 id="directions-heading" className="sr-only">{t('mapLinks.title')}</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2  ">
          <Icon name="map" category="ui" className="w-5 h-5 text-text dark:text-[#96b6c9]" />
          <h3 className="font-semibold text-lg text-text dark:text-[#96b6c9]">
            {t('mapLinks.title')}
          </h3>

          </div>

          <div className="mx-auto max-w-[350px] grid grid-cols-2 xsm:flex xs:flex-wrap xs:justify-center gap-6 items-center">
            {/* Waze Map Link with Tooltip */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a 
                    href={generateWazeUrl()} 
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

            {/* Moovit Link with Tooltip */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a 
                    href={generateMoovitUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`${t('mapLinks.moovitLink')} ${parkName}`}
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
                      name={theme === 'dark' ? "moovitDark" : "moovit"} 
                      category="action" 
                      className="w-[3.15rem] h-[3.15rem] -mt-[2px] sm:w-[2.65rem] sm:h-[2.65rem] text-text-dark dark:text-text drop-shadow-md dark:drop-shadow-lg overflow-visible"
                    />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-center">
                  {t('mapLinks.moovitLink')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Apple Maps Link with Tooltip */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a 
                    href={generateAppleMapsUrl()} 
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
                          duration: 0.01
                        }
                      },
                    }}
                    initial="initial"
                    whileHover="hover"
                  >
                    <Icon 
                      name={theme === 'dark' ? "newAppleMapsDark" : "newAppleMaps"} 
                      category="action" 
                      className="w-[3.15rem] h-[3.15rem] -mt-[2px] sm:w-[2.65rem] sm:h-[2.65rem] text-[#3a3a3a] dark:text-text-secondary-dark drop-shadow-md dark:drop-shadow-lg overflow-visible"
                    />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-center">
                  {t('mapLinks.appleLink')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Google Maps Link with Tooltip */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a 
                    href={generateGoogleMapsUrl()} 
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
          </div>
        </div>
    </section>
  )
} 