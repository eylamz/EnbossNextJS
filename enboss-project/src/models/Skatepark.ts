import mongoose, { Schema } from 'mongoose'

export interface ISkateparkLocation {
  latitude: number
  longitude: number
}

export interface IDaySchedule {
  openingTime: string
  closingTime: string
  isOpen: boolean
}

export interface IOperatingHours {
  sunday: IDaySchedule
  monday: IDaySchedule
  tuesday: IDaySchedule
  wednesday: IDaySchedule
  thursday: IDaySchedule
  friday: IDaySchedule
  saturday: IDaySchedule
  holidays: IDaySchedule
}

export interface ILightingHours {
  startTime: string
  endTime: string
  is24Hours: boolean
}

export interface IAmenities {
  entryFee: boolean
  parking: boolean
  bathroom: boolean
  helmetRequired: boolean
  guard: boolean
  seating: boolean
  bombShelter: boolean
  scootersAllowed: boolean
  bikesAllowed: boolean
  noWax: boolean
}

export interface ISkateparkImage {
  url: string
  isFeatured: boolean
  orderNumber: number
}

export interface ISkatepark {
  nameEn: string
  nameHe: string
  slug: string
  area: 'north' | 'center' | 'south'
  status: 'active' | 'inactive'
  addressEn: string
  addressHe: string
  openingYear: number
  closingYear?: number
  location: ISkateparkLocation
  operatingHours: IOperatingHours
  lightingHours: ILightingHours
  amenities: IAmenities
  isFeatured: boolean
  images: ISkateparkImage[]
  mediaLinks: {
    googleMapsFrame?: string
    googleMapsUrl?: string
    wazeUrl?: string
    appleMapsUrl?: string
    youtubeUrl?: string
  }
  notesEn?: string
  notesHe?: string
  rating?: number
  ratingCount?: number
}

const DayScheduleSchema = new Schema<IDaySchedule>({
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  isOpen: { type: Boolean, default: false }
})

const OperatingHoursSchema = new Schema<IOperatingHours>({
  sunday: { type: DayScheduleSchema, required: true },
  monday: { type: DayScheduleSchema, required: true },
  tuesday: { type: DayScheduleSchema, required: true },
  wednesday: { type: DayScheduleSchema, required: true },
  thursday: { type: DayScheduleSchema, required: true },
  friday: { type: DayScheduleSchema, required: true },
  saturday: { type: DayScheduleSchema, required: true },
  holidays: { type: DayScheduleSchema, required: true }
})

const LightingHoursSchema = new Schema<ILightingHours>({
  startTime: { type: String, required: false },
  endTime: { type: String, required: false },
  is24Hours: { type: Boolean, default: false }
})

const AmenitiesSchema = new Schema<IAmenities>({
  entryFee: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  bathroom: { type: Boolean, default: false },
  helmetRequired: { type: Boolean, default: false },
  guard: { type: Boolean, default: false },
  seating: { type: Boolean, default: false },
  bombShelter: { type: Boolean, default: false },
  scootersAllowed: { type: Boolean, default: false },
  bikesAllowed: { type: Boolean, default: false },
  noWax: { type: Boolean, default: false }
})

const SkateparkImageSchema = new Schema<ISkateparkImage>({
  url: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  orderNumber: { type: Number, required: true }
})

const SkateparkSchema = new Schema<ISkatepark>(
  {
    nameEn: { type: String, required: true },
    nameHe: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    area: { type: String, required: true, enum: ['north', 'center', 'south'] },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    addressEn: { type: String, required: true },
    addressHe: { type: String, required: true },
    openingYear: { type: Number, required: true },
    closingYear: { type: Number },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    operatingHours: { type: OperatingHoursSchema, required: true },
    lightingHours: { type: LightingHoursSchema, required: true },
    amenities: { type: AmenitiesSchema, required: true },
    isFeatured: { type: Boolean, default: false },
    images: [SkateparkImageSchema],
    mediaLinks: {
      googleMapsFrame: { type: String },
      googleMapsUrl: { type: String },
      wazeUrl: { type: String },
      appleMapsUrl: { type: String },
      youtubeUrl: { type: String }
    },
    notesEn: { type: String },
    notesHe: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Skatepark || mongoose.model<ISkatepark>('Skatepark', SkateparkSchema)