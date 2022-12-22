export interface CreateVendorInput {
  name: string
  ownerName: string
  foodType: [string]
  pincode: string
  address: string
  phone: string
  email: string
  password: string
}

export interface EditVendorInputs {
  name: string
  address: string
  phone: string
  foodTypes: [string]
}

export interface VendorLoginInputs {
  email: string
  password: string
}

export interface VendorPayload {
  _id: string
  name: string
  email: string
  foodTypes: [string]
}

export interface CreateOfferInputs {
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
