import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const orderSchema = object().shape({
    tableId: number().required('tableId must be required').typeError('TableId must be a number'),
    userId: number().typeError('UserId must be a number'),
    statusId: number().typeError('StatusId must be a number'),
    payment: string().typeError('Payment must be a string').required('Payment must be required').oneOf(['Tiền mặt', 'Ngân hàng'], 'Payment must be either "Tiền mặt" or "Ngân hàng"'),
  });

const validateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await orderSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateOrder;
