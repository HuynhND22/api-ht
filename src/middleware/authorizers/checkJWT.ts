
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require('dotenv').config();

const checkJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const check = await jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const role = await jwt.decode(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        console.log(role.role);
        if (check) next();
    } catch (error:any) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default checkJWT;
