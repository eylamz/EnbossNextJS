import mongoose, { Schema } from 'mongoose'

export interface IProductVariant {
  color: string
  hexCode: string
  sizes: {
    size: string
    price: number
    stock: number
  }[]
  images: string[]
}

export interface IProduct {
  name: string
  slug: string
  description: string
  category: string
  variants: IProductVariant[]
  basePrice: number
  discount?: number
  status: 'active' | 'inactive'
  isFeatured: boolean
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    variants: [{
      color: { type: String, required: true },
      hexCode: { type: String, required: true },
      sizes: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 }
      }],
      images: [{ type: String, required: true }]
    }],
    basePrice: { type: Number, required: true },
    discount: { type: Number },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    isFeatured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)