import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const bankSchema = object().shape({
    accountNumber: string().required('Account number must be required'),
    author: string().required('Author must be required'),
    bankName: string().required('Bank name must be required')
  });

const validateBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await bankSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateBank;
