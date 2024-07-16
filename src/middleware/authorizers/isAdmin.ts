
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require('dotenv').config();

const checkJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');
        const auth = await jwt.decode(token?.replace('Bearer ', ''), process.env.JWT_SECRET)
        if (auth.role !== 'Quản trị viên') {
            return res.status(403).json({ message: 'Forbidden'});
        };
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(403).json({ message: 'Forbidden'});
    }
}

export default checkJWT;
