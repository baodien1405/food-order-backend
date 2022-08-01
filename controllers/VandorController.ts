import { Request, Response, NextFunction } from 'express'
import { EditVandorInputs, VandorLoginInputs } from '../dto'
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
