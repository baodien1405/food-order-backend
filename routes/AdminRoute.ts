import express, { Request, Response, NextFunction } from 'express'
import { CreateVandor, GetVandorByID, GetVandors } from '../controllers'

const router = express.Router()

router.post('/vandor', CreateVandor)

router.get('/vandors', GetVandors)

router.get('/vandor/:id', GetVandorByID)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json('Admin route')
})

export { router as AdminRoute }
