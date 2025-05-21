import mongoose, { Schema } from 'mongoose'

export interface IGuide {
  titleHe: string
  titleEn: string
  slug: string
  contentHe: string
  contentEn: string
  tagsHe: string[]
  tagsEn: string[]
  category: 'roller' | 'skate' | 'scoot' | 'bike'
  featuredImage: string
  images: string[]
  status: 'draft' | 'active' | 'inactive'
  isFeatured: boolean
}

const GuideSchema = new Schema<IGuide>(
  {
    titleHe: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    contentHe: { type: String, required: true },
    contentEn: { type: String, required: true },
    tagsHe: [{ type: String }],
    tagsEn: [{ type: String }],
    category: { type: String, required: true, enum: ['roller', 'skate', 'scoot', 'bike'] },
    featuredImage: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, required: true, enum: ['draft', 'active', 'inactive'], default: 'draft' },
    isFeatured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema)