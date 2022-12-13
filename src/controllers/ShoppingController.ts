import express, { Request, Response, NextFunction } from 'express'
import { FoodDoc, Vandor } from '../models'

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode
  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false })
    .sort({ rating: 'desc' })
    .populate('foods')

  if (result.length > 0) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'Data not found' })
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode
  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false }).sort({ rating: 'desc' }).limit(10)

  if (result.length > 0) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'Data not found' })
}

export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode
  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false }).populate('foods')

  if (result.length > 0) {
    let foodResult: any = []

    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc]
      foodResult.push(...foods.filter((food) => food.readyTime < 30))
    })

    return res.status(200).json(foodResult)
  }

  return res.status(400).json({ message: 'Data not found' })
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode
  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false }).populate('foods')

  if (result.length > 0) {
    let foodResult: any = []

    result.map((item) => foodResult.push(...item.foods))

    return res.status(200).json(foodResult)
  }

  return res.status(400).json({ message: 'Data not found' })
}

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const result = await Vandor.findById(id).populate('foods')

  if (result) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'Data not found' })
}
