import express from 'express'
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
  CreateOrder,
  GetOrders,
  GetOrderById
} from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

/** ---------------------- Signup / Create Customer ---------------------- **/
router.post('/signup', CustomerSignUp)

/** ---------------------- Login ---------------------- **/
router.post('/login', CustomerLogin)

// Authentication
router.use(Authenticate)

/** ---------------------- Verify Customer Account ---------------------- **/
router.patch('/verify', CustomerVerify)

/** ---------------------- OTP / Requesting OTP ---------------------- **/
router.get('/otp', RequestOtp)

/** ---------------------- Profile ---------------------- **/
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)

// Cart
// Payment

// Order
router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders)
router.get('/order/:id', GetOrderById)

export { router as CustomerRoute }
