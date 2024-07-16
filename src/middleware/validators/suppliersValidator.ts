import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const supplierSchema = object().shape({
    name: string().required('Name must be required'),
    email: string().required('Email must be required').email('Email must be a valid email'),
    phoneNumber: string().required('Phone number must be required').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Phone number must be a valid Vietnamese phone number'),
    address: string().notRequired(),
    wardId: number().notRequired().typeError('WardId must be a number'),
    statusId: number().required('StatusId must be required').typeError('StatusId must be a number')
  });

const validateSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await supplierSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateSupplier;
