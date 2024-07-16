import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { IsNull, Not } from 'typeorm';
import { User } from '../entities/user.entity';
import checkUnique from '../helpers/checkUnique';
import { handleUniqueError } from '../helpers/handleUniqueError';

const repository = AppDataSource.getRepository(User);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await repository.find({ order: {createdAt: 'DESC'}, select: ['userId', 'firstName', 'lastName', 'gender', 'email', 'phoneNumber', 'role', 'createdAt', 'updatedAt', 'deletedAt']});
        if (users.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bcrypt = require('bcrypt');
        const saltRounds = 7;
        
        let data = req.body;
        const password = req.body.password;

        if (data['password']) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            data['password'] = hashedPassword;
            console.log('password: ' + password);
            console.log(hashedPassword)
        } 

        const user = new User();
        Object.assign(user, data);
        await repository.save(user);
        return res.json(user);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: error });
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 7;
    try {
        const user = await repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        let data = req.body;
        if(data.password) {            
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            data['password'] = hashedPassword;
        }

        Object.assign(user, data);
        await repository.save(user);
        return res.json(user);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.softDelete({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await repository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) } });
        if (users.length === 0) {
            return res.status(204).json({ error: 'No content' });
        }
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await repository.findOne({ withDeleted: true, where: { userId: parseInt(req.params.id), deletedAt: Not(IsNull()) } });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.restore({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await repository.findOne({ withDeleted: true, where: { userId: parseInt(req.params.id), deletedAt: Not(IsNull())} });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.delete({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const checkUserUnique = async (req: Request, res: Response, next: NextFunction) => {
    const {value, ignore, field} = req.query;
  
    if(ignore && ignore == value) {
        return res.sendStatus(200)
    }

    try {
        const check = await checkUnique(User, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default {getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkUserUnique}
