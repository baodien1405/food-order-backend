import express, { Request, Response, NextFunction } from 'express'
import {
  AddFood,
  AddOffer,
  EditOffer,
  GetCurrentOrders,
  GetFoods,
  GetOffers,
  GetOrderDetails,
  GetVendorProfile,
  ProcessOrder,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin
} from '../controllers'
import { Authenticate } from '../middlewares'
import multer from 'multer'

const router = express.Router()

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString()}_${file.originalname}`)
  }
})

const images = multer({ storage: imageStorage }).array('images', 10)

router.post('/login', VendorLogin)

router.use(Authenticate)
router.get('/profile', GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/cover-image', images, UpdateVendorCoverImage)
router.patch('/service', UpdateVendorService)

router.post('/food', images, AddFood)
router.get('/foods', GetFoods)

// Orders
router.get('/orders', GetCurrentOrders)
router.put('/order/:id/process', ProcessOrder)
router.get('/order/:id', GetOrderDetails)

// Offers
router.get('/offers', GetOffers)
router.post('/offer', AddOffer)
router.put('/offer/:id', EditOffer)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json('Vendor route')
})

export { router as VendorRoute }
