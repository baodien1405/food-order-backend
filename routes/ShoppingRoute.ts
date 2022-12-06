import express, { Request, Response, NextFunction } from 'express'
import { GetFoodAvailability, GetFoodIn30Min, GetTopRestaurants, SearchFoods, GetRestaurantById } from '../controllers'

const router = express.Router()

/** ---------------------- Food Availability ---------------------- **/
router.get('/:pincode', GetFoodAvailability)

/** ---------------------- Top Restaurants ---------------------- **/
router.get('/top-restaurants/:pincode', GetTopRestaurants)

/** ---------------------- Foods Available in 30 minutes ---------------------- **/
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min)

/** ---------------------- Search Foods ---------------------- **/
router.get('/search/:pincode', SearchFoods)

/** ---------------------- Find Restaurant By ID ---------------------- **/
router.get('/restaurant/:id', GetRestaurantById)

export { router as ShoppingRoute }
