import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const tableSchema = object().shape({
    name: string().required('Name must be required'),
    seat: number().required('Seat must be required').typeError('Seat must be a number'),
    statusId: number().notRequired()
  });

const validateTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await tableSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateTable;
