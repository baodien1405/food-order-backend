import { Request, Response, NextFunction } from 'express'
import { CreateFoodInputs, EditVandorInputs, VandorLoginInputs } from '../dto'
import { Food } from '../models'
import { GenerateSignature, ValidatePassword } from '../utility'
import { FindVandor } from './AdminController'

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VandorLoginInputs>req.body

  const existingVandor = await FindVandor('', email)

  if (existingVandor !== null) {
    const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt)

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        foodTypes: existingVandor.foodType,
        name: existingVandor.name
      })

      return res.json(signature)
    } else {
      return res.json({ message: 'Password is not valid' })
    }
  }

  return res.json({ message: 'Login credential not valid' })
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (user) {
    const existingVandor = await FindVandor(user._id)
    return res.json(existingVandor)
  }

  return res.json({ message: 'Vandor information not found' })
}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, phone, foodTypes } = <EditVandorInputs>req.body
  const user = req.user

  if (user) {
    const existingVandor = await FindVandor(user._id)

    if (existingVandor !== null) {
      existingVandor.name = name
      existingVandor.address = address
      existingVandor.phone = phone
      existingVandor.foodType = foodTypes

      const saveResult = await existingVandor.save()
      return res.json(saveResult)
    }
    return res.json(existingVandor)
  }

  return res.json({ message: 'Vandor information not found' })
}

export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (user) {
    const vandor = await FindVandor(user._id)

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File]
      const images = files.map((file: Express.Multer.File) => file.filename)
      vandor.coverImages.push(...images)

      const result = await vandor.save()
      return res.json(result)
    }
    // return res.json(vandor)
  }

  return res.json({ message: 'Vandor information not found' })
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (user) {
    const existingVandor = await FindVandor(user._id)

    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable

      const saveResult = await existingVandor.save()
      return res.json(saveResult)
    }
    return res.json(existingVandor)
  }

  return res.json({ message: 'Vandor information not found' })
}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body

    const vandor = await FindVandor(user._id)

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File]
      const images = files.map((file: Express.Multer.File) => file.filename)

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0
      })

      vandor.foods.push(createdFood)
      const result = await vandor.save()

      return res.json(result)
    }
  }

  return res.json({ message: 'Something went wrong with add food' })
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (user) {
    const foods = await Food.find({ vandorId: user._id })

    if (foods !== null) {
      return res.json(foods)
    }
  }

  return res.json({ message: 'Foods information is not found' })
}
