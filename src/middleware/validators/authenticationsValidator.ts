import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const authSchema = object().shape({
    email: string().email('Email is invalid').required('Email must be required'),
    password: string().required('Password must be required')
  });

const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateAuth;
