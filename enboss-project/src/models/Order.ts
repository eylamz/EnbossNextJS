import mongoose, { Schema } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  color: string
  size: string
  image: string
}

export interface IOrder {
  user: mongoose.Types.ObjectId
  orderItems: IOrderItem[]
  shippingAddress: {
    name: string
    street: string
    city: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string
    status: string
    email: string
  }
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      image: { type: String, required: true }
    }],
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      email: { type: String }
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    trackingNumber: { type: String }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)