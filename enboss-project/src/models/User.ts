import mongoose, { Schema } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  addresses: {
    name: string
    street: string
    city: string
    zipCode: string
    country: string
    phone: string
    isDefault: boolean
  }[]
  favoriteParks: mongoose.Types.ObjectId[]
  favoriteGuides: mongoose.Types.ObjectId[]
  favoriteProducts: mongoose.Types.ObjectId[]
  preferences: {
    language: 'he' | 'en'
    theme: 'light' | 'dark'
  }
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    addresses: [{
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }],
    favoriteParks: [{ type: Schema.Types.ObjectId, ref: 'Skatepark' }],
    favoriteGuides: [{ type: Schema.Types.ObjectId, ref: 'Guide' }],
    favoriteProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    preferences: {
      language: { type: String, enum: ['he', 'en'], default: 'he' },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)