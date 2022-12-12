import express, { Request, Response, NextFunction } from 'express'
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile
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
// Order
// Payment

export { router as CustomerRoute }
