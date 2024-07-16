import {date, number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const promotionSchema = object().shape({
    name: string().required('Name must be required'),
    limit: number().required('Limit must be required').typeError('Limit must be a number'),
    price: number().required('Price must be required').typeError('Price must be a number'),
    startDate: date().required('Start date must be required').typeError('Start date must be a date'),
    endDate: date().required('End date must be required').typeError('End date must be a date'),
    statusId: number().required('StatusId must be required').typeError('StatusId must be a number'),
  });

const validatePromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await promotionSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validatePromotion;
