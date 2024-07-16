import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const cartSchema = object().shape({
    tableId: number().required('TableId must be required').typeError('TableId must be a number'),
    productSizeId: number().notRequired().typeError('ProductSize must be a number'),
    promotionId: number().notRequired().typeError('PromotionId must be a number'),
    quantity: number().required('Quantity must be required')
  });

const validateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cartSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateCart;
