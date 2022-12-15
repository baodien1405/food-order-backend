import { GeneratePassword, GenerateSignature, ValidatePassword } from './../utility'
import { plainToInstance } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { GenerateOtp, GenerateSalt, onRequestOTP } from '../utility'
import { Customer, Food } from '../models'
import { CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInputs, OrderInputs } from '../dto'
import { Order } from '../models/Order'

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToInstance(CreateCustomerInputs, req.body)
  const inputErrors = await validate(customerInputs, { validationError: { target: true } })

  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors)
  }

  const { email, phone, password } = customerInputs

  const salt = await GenerateSalt()
  const userPassword = await GeneratePassword(password, salt)

  const { otp, expiry } = GenerateOtp()

  const existCustomer = await Customer.findOne({ email: email })
  if (existCustomer !== null) {
    return res.status(409).json({ message: 'An user exist with the provided email ID' })
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
    cart: [],
    orders: []
  })

  if (result) {
    // send the OTP to customer
    await onRequestOTP(otp, phone)

    // generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified
    })

    // send the result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email
    })
  }
  return res.status(400).json({ message: 'Error with signup' })
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginInputs = plainToInstance(UserLoginInputs, req.body)
  const loginErrors = await validate(loginInputs, { validationError: { target: false } })

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors)
  }
  const { email, password } = loginInputs
  const customer = await Customer.findOne({ email: email })

  if (customer) {
    const validation = await ValidatePassword(password, customer.password, customer.salt)

    if (validation) {
      // generate the signature
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified
      })

      // send the result to client
      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email
      })
    }
  }

  return res.status(404).json({ message: 'Login error' })
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body
  const customer = req.user

  if (customer) {
    const profile = await Customer.findById(customer._id)
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true

        const updatedCustomerResponse = await profile.save()

        // generate the signature
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified
        })

        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email
        })
      }
    }
  }
  return res.status(400).json({ message: 'Error with OTP Validation' })
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user

  if (customer) {
    const profile = await Customer.findById(customer._id)

    if (profile) {
      const { otp, expiry } = GenerateOtp()
      profile.otp = otp
      profile.otp_expiry = expiry

      await profile.save()
      await onRequestOTP(otp, profile.phone)

      return res.status(200).json({ message: 'OTP sent your registered phone number!' })
    }
  }
  return res.status(400).json({ message: 'Error with Request OTP' })
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user

  if (customer) {
    const profile = await Customer.findById(customer._id)

    if (profile) {
      return res.status(200).json(profile)
    }
  }

  return res.status(400).json({ message: 'Error with fetch profile' })
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user
  const profileInputs = plainToInstance(EditCustomerProfileInputs, req.body)

  const profileErrors = await validate(profileInputs, { validationError: { target: false } })

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors)
  }

  const { firstName, lastName, address } = profileInputs

  if (customer) {
    const profile = await Customer.findById(customer._id)

    if (profile) {
      profile.firstName = firstName
      profile.lastName = lastName
      profile.address = address

      const result = await profile.save()

      return res.status(200).json(result)
    }
  }

  return res.status(400).json({ message: 'Error with edit profile' })
}

/** -------------------------- Cart Section -------------------------- **/
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user

  if (customer) {
    const profile = await Customer.findById(customer._id).populate('cart.food')
    let cartItems = Array()

    const { _id, unit } = <OrderInputs>req.body
    const food = await Food.findById(_id)

    if (food) {
      if (profile !== null) {
        // check for cart items
        cartItems = profile.cart

        if (cartItems.length > 0) {
          // check and update unit
          let existFoodItem = cartItems.filter((item) => item.food._id.toString() === _id)

          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0])
            if (unit > 0) {
              cartItems[index] = { food, unit }
            } else {
              cartItems.splice(index, 1)
            }
          } else {
            cartItems.push({ food, unit })
          }
        } else {
          // add new item to cart
          cartItems.push({ food, unit })
        }

        if (cartItems) {
          profile.cart = cartItems as any
          const cartResult = await profile.save()

          return res.status(200).json(cartResult.cart)
        }
      }
    }
  }
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user
  if (customer) {
    const profile = await Customer.findById(customer._id).populate('cart.food')
    if (profile) {
      return res.status(200).json(profile.cart)
    }
  }
  return res.status(400).json({ message: 'Cart is empty!' })
}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user
  if (customer) {
    const profile = await Customer.findById(customer._id).populate('cart.food')
    if (profile !== null) {
      profile.cart = [] as any
      const cartResult = await profile.save()

      return res.status(200).json(cartResult)
    }
  }
  return res.status(400).json({ message: 'Cart is already empty!' })
}

/** -------------------------- Order Section -------------------------- **/
export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  // grab current login customer
  const customer = req.user

  if (customer) {
    // create an order ID
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`
    const profile = await Customer.findById(customer._id)

    // grab order items from request [{ id: XX, unit: XX }]
    const cart = <[OrderInputs]>req.body // [{ id: XX, unit: XX }]

    let cartItems = Array()
    let netAmount = 0.0
    let vendorId

    // calculate order amount
    const foods = await Food.find()
      .where('_id')
      .in(cart.map((item) => item._id))
      .exec()

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId
          netAmount += food.price * unit
          cartItems.push({ food, unit })
        }
      })
    })

    // create order with item description
    if (cartItems) {
      // create Order
      const currentOrder = await Order.create({
        orderID: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: 'COD',
        paymentResponse: '',
        orderStatus: 'waiting',
        remarks: '',
        deliveryId: '',
        appliedOffer: false,
        offerId: null,
        readyTime: 45
      })

      if (currentOrder) {
        // finally update orders to user account
        profile.cart = [] as any
        profile.orders.push(currentOrder)
        await profile.save()

        return res.status(200).json(currentOrder)
      }
    }
  }

  return res.status(400).json({ message: 'Error with create order!' })
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user

  if (customer) {
    const profile = await Customer.findById(customer._id).populate('orders')

    if (profile) {
      return res.status(200).json(profile.orders)
    }
  }

  return res.status(400).json({ message: 'Error with fetch orders!' })
}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id

  if (orderId) {
    const order = await Order.findById(orderId).populate('items.food')

    if (order) {
      return res.status(200).json(order)
    }
  }

  return res.status(400).json({ message: 'Error with get order!' })
}
