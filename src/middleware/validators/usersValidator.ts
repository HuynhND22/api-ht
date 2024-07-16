import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const userSchema = object().shape({
    firstName: string().required('First name must be required'),
    lastName: string().required('Last name must be required'),
    gender: string().required('Gender must be required').oneOf(['Nam', 'Nữ'], 'Gender must be either "Nam" or "Nữ"'),
    email: string().email('Email is invalid').required('Email must be required'),
    phoneNumber: string().notRequired().max(10, 'Phone number must be 10 characters').matches(/^[0-9]+$/, 'Phone number must be a number'),
    address: string().notRequired(),
    role: string().required('Role must be required').oneOf(['Quản trị viên', 'Nhân viên'], 'Role must be either "Quản trị viên" or "Nhân viên'),
  });

const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateUser;
