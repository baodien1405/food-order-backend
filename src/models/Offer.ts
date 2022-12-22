import mongoose, { Schema, Document } from 'mongoose'

export interface OfferDoc extends Document {
  offerType: string // VENDOR // GENERIC
  vendors: [any] // ['857637sdasd']
  title: string // INR 200 off on week days
  description: string // any description with terms and conditions
  minValue: number // minimum order amount should 300
  offerAmount: number // 200
  startValidity: Date
  endValidity: Date
  promoCode: string // WEEK200
  promoType: string // USER // ALL // BANK // CARD
  bank: [any]
  bins: [any]
  pincode: string
  isActive: boolean
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: 'vendor' }],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bins: [{ type: String }],
    pincode: { type: String, required: true },
    isActive: { type: Boolean }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt
      }
    },
    timestamps: true
  }
)

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema)

export { Offer }
