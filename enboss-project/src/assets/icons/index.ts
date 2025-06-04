// src/assets/icons/index.ts

import React from 'react';
import Helmet from './helmet.svg';
import Toilet from './toilet.svg';
import Parking from './parking.svg';
import Guard from './securityGuard.svg';
import Broom from './broom.svg';
import Scoot from './scooter.svg';
import Bike from './bmx-icon.svg';
import BombShelter from './safe-house.svg';
import Shekel from './shekel.svg';
import Couch from './couch.svg';
import Umbrella from './umbrella.svg';
import MapPinBold from './locationBold.svg';
import MapPin from './location.svg';
import AmenitiesBold from './notesBold.svg';
import InfoBold from './infoBold.svg';
import ClockBold from './clockBold.svg';
import LightbulbBold from './lightbulbBold.svg';
import Sunset from './sunset.svg';
import Sun from './sun.svg';
import SunBold from './sunBold.svg';
import Moon from './moon.svg';
import MoonBold from './moonBold.svg';
import Menu from './menu.svg';
import Hours24 from './hours24.svg';
import MapBold from './map.svg';
import LocationOff from './locationOff.svg';
import LocationOffBold from './locationOffBold.svg';
import HeartLiked from './heartLike.svg';
import Heart from './heart.svg';
import HeartBold from './heartBold.svg';
import FilterBold from './filterBold.svg';
import Filter from './filter.svg';
import Close from './close.svg';
import X from './X.svg';
import ImageBold from './imageBold.svg';
import BulkImage from './bulkImage.svg';
import Logo from './logo.svg';
import LogoHostage from './logo-hostage.svg';
import LogoHostage2 from './logo-hostage2.svg';
import LogoHostage3 from './logo-hostage3.svg';
import GymWeightBold from './gymWeightBold.svg';
import GymWeight from './gymWeight.svg';
import WrenchBold from './wrenchBold.svg';
import GoogleMaps from './googleMaps.svg';
import newGoogleMaps from './newGoogleMaps.svg';
import newAppleMaps from './newAppleMaps.svg';
import newAppleMapsDark from './newAppleMapsDark.svg';
import Waze from './wazeMaps.svg';
import WazeDark from './wazeDark.svg';
import GoogleMapsBold from './googleMapsBold.svg';
import AppleMapsBold from './appleMapsBold.svg';
import WazeBold from './wazeBold.svg';
import NoWax from './Wax.svg';
import NearbyRestaurants from './nearbyResturants.svg';
import Roller from './Roller.svg';
import Skate from './Skate.svg';
import Search from './search.svg';
import SearchQuest from './searchQuest.svg';
import Sparks from './sparks.svg';
import New from './new.svg';
import Featured from './featured.svg';
import Archive from './archive.svg';
import ClosedPark from './closedPark.svg';
import IsraelFlag from './israelFlag.svg';
import UsaFlag from './usaFlag.svg';
import Instagram from './instagram.svg';
import Youtube from './youtube.svg';
import Messages from './messages.svg';
import Tiktok from './tiktok.svg';
import Trash from './trash.svg';
import TrashBold from './trashBold.svg';
import Link from './link.svg';
import Share from './share.svg';
import ShareBold from './shareBold.svg';
import User from './account.svg';
import Moovit from './moovit.svg';
import MoovitDark from './moovitDark.svg';
import Park from './trees.svg';

// Type for SVG components
type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Base type for all icon configurations
interface BaseIconConfig {
    icon: SvgComponent;
    label: string;
}

// Define IconConfig based on BaseIconConfig
export interface IconConfig extends BaseIconConfig {}

// Amenity Icons
export const amenityIcons = {
  entryFee: { icon: Shekel, label: 'Parking' },
  parking: { icon: Parking, label: 'Parking' },
  bathroom: { icon: Toilet, label: 'Bathroom' },
  shade: { icon: Umbrella, label: 'Shade' },
  seating: { icon: Couch, label: 'Seating' },
  guard: { icon: Guard, label: 'Guard' },
  bombShelter: { icon: BombShelter, label: 'Bomb Shelter' },
  helmetRequired: { icon: Helmet, label: 'Helmet Required' },
  scootersAllowed: { icon: Scoot, label: 'Scooters Allowed' },
  bikesAllowed: { icon: Bike, label: 'Bikes Allowed' },
  noWax: { icon: NoWax, label: 'No Wax Allowed' },
  nearbyRestaurants: { icon: NearbyRestaurants, label: 'Nearby Restaurants' }
} as const;

// Navigation Icons
export const navigationIcons = {
  location: { icon: MapPin, label: 'Location' },
  locationBold: { icon: MapPinBold, label: 'Location' },
  locationOff: { icon: LocationOff, label: 'Location Off' },
  locationOffBold: { icon: LocationOffBold, label: 'Location Off' },
  search: { icon: Search, label: 'Search' },
  searchQuest: { icon: SearchQuest, label: 'No Results' },
  filter: { icon: Filter, label: 'Filter' },
  filterBold: { icon: FilterBold, label: 'Filter' },
  close: { icon: Close, label: 'Close' },
  X: { icon: X, label: 'Close' },
  menu: { icon: Menu, label: 'Menu' }

} as const;

// Action Icons
export const actionIcons = {
  favorite: { icon: Heart, label: 'Favorite' },
  googleMaps: { icon: GoogleMaps, label: 'Google Maps' },
  newGoogleMaps: { icon: newGoogleMaps, label: 'Google Maps' },
  newAppleMaps: { icon: newAppleMaps, label: 'Apple Maps' },
  newAppleMapsDark: { icon: newAppleMapsDark, label: 'Apple Maps' },
  waze: { icon: Waze, label: 'Waze' },
  wazeDark: { icon: WazeDark, label: 'Waze' },
  moovit: { icon: Moovit, label: 'Moovit' },
  moovitDark: { icon: MoovitDark, label: 'Moovit' },
  googleMapsBold: { icon: GoogleMapsBold, label: 'Google Maps' },
  appleMapsBold: { icon: AppleMapsBold, label: 'Apple Maps' },
  wazeBold: { icon: WazeBold, label: 'Waze' },
  instagram: { icon: Instagram, label: 'Instagram' },
  youtube: { icon: Youtube, label: 'Youtube' },
  messages: { icon: Messages, label: 'Messages' },
  tiktok: { icon: Tiktok, label: 'Tiktok' },
  trash: { icon: Trash, label: 'Trash' },
  trashBold: { icon: TrashBold, label: 'Trash' },
  link: { icon: Link, label: 'Link' },
  shareArrow: { icon: Share, label: 'Share' },
  shareArrowBold: { icon: ShareBold, label: 'Share' }
} as const;

// Rating Icons
export const ratingIcons = {
  heart: { icon: Heart, label: 'Like' },
  heartLiked: { icon: HeartLiked, label: 'Voted' },
  maintenance: { icon: WrenchBold, label: 'Maintenance' },
  cleanliness: { icon: Broom, label: 'Cleanliness' },
  difficultyBold: { icon: GymWeightBold, label: 'Difficulty' },
  difficulty: { icon: GymWeight, label: 'Difficulty' }
} as const;

// UI Icons
export const uiIcons = {
  logo: { icon: Logo, label: 'ENBOSS logo' },
  logoHostage: { icon: LogoHostage, label: 'Hostage logo' },
  logoHostage2: { icon: LogoHostage2, label: 'Hostage logo' },
  logoHostage3: { icon: LogoHostage3, label: 'Hostage logo' },
  clock: { icon: ClockBold, label: 'Clock' },
  amenitiesBold: { icon: AmenitiesBold, label: 'Notes' },
  infoBold: { icon: InfoBold, label: 'Notes' },
  user: { icon: User, label: 'User' },
  sun: { icon: Sun, label: 'Sun' },
  sunBold: { icon: SunBold, label: 'Sun' },
  moon: { icon: Moon, label: 'Moon' },
  moonBold: { icon: MoonBold, label: 'Moon' },
  sunset: { icon: Sunset, label: 'Sunset' },
  lightbulbBold: { icon: LightbulbBold, label: 'Lightbulb' },
  heartBold: { icon: HeartBold, label: 'Heart' },
  heart: { icon: Heart, label: 'Heart' },
  hours24: { icon: Hours24, label: '24 Hours' },
  map: { icon: MapBold, label: 'Map' },
  imageBold: { icon: ImageBold, label: 'Image' },
  bulkImage: { icon: BulkImage, label: 'Image' },
  sparks: { icon: Sparks, label: 'Sparks' },
  new: { icon: New, label: 'New' },
  featured: { icon: Featured, label: 'Featured' },
  archive: { icon: Archive, label: 'Archive' },
  closedPark: { icon: ClosedPark, label: 'Closed Park' },
  israelFlag: { icon: IsraelFlag, label: 'Israel Flag' },
  usaFlag: { icon: UsaFlag, label: 'Usa Flag' },
  park: { icon: Park, label: 'Park' },
} as const;

//  Guide Icons
export const guideIcons = {
  roller: { icon: Roller, label: 'Roller' },
  skate: { icon: Skate, label: 'Skate' }
} as const;

// Icon categories mapping
const iconCategories = {
  amenity: amenityIcons,
  navigation: navigationIcons,
  action: actionIcons,
  rating: ratingIcons,
  ui: uiIcons,
  guide: guideIcons
} as const;

// Type definitions
type IconCategoryType = typeof iconCategories;
type IconCategoryKeys = keyof IconCategoryType;
// Removed IconNamesFromCategory as it might complicate type inference here
// type IconNamesFromCategory<T extends IconCategoryKeys> = keyof IconCategoryType[T];

// Custom Icon Component Props
interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  category: IconCategoryKeys;
  size?: string | number;
  color?: string;
}

// Custom Icon Component
export const Icon: React.FC<CustomIconProps> = ({
  name,
  category,
  size,
  color,
  ...props
}) => {
  const selectedCategory = iconCategories[category];

  if (!selectedCategory || !(name in selectedCategory)) {
    console.warn(`Icon "${name}" not found in category "${category}"`);
    return null;
  }

  const iconName = name as keyof typeof selectedCategory;
  const iconConfig = selectedCategory[iconName];
  const validIconConfig = iconConfig as BaseIconConfig;
  const IconComponent = validIconConfig.icon;

  const svgProps: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    color: color,
    ...props
  };

  return React.createElement(IconComponent, svgProps);
};

// Helper function to add new icons (remains the same)
export const extendIcons = <T extends IconCategoryKeys>(
  category: T,
  newIcons: Partial<Record<string, IconConfig>> // Uses the updated IconConfig
) => {
  const categoryIcons = iconCategories[category];
  // Use type assertion for assign target if necessary, though 'as any' is simpler here
  Object.assign(categoryIcons as any, newIcons);
};

// Export types
export type {
  IconCategoryType,
  IconCategoryKeys,
  // IconNamesFromCategory, // Keep commented out or remove if not needed elsewhere
  CustomIconProps
};