import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entities/user.entity';

require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const repository = AppDataSource.getRepository(User);


const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await repository.findOne({where: {email: email}});

        const payload = {
            email: user?.email,
            role: user?.role,
            iat: Date.now(),
          };

        await bcrypt.compare(password, user?.password, function(err:Error, result:any) {
            if(result == true) {
                jwt.sign(payload, 
                    process.env.JWT_SECRET,
                    (err:Error, token:any) => {
                        console.log(err);
                        return res.status(200).json({
                            token: token,
                            user: {
                                id: user?.userId,
                                email: user?.email,
                                role: user?.role,
                                name: `${user?.firstName} ${user?.lastName}`
                            }
                        });
                    }
                );
            } else{
                return res.status(401).json({message: 'Email or password is incorrect'})
            }
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

export default {login}
