import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database";
import { Post } from "../entities/post.entity";
import { handleUniqueError } from "../helpers/handleUniqueError";
import fs from "fs";
import { IsNull, Not, Like } from "typeorm";
import checkUnique from "../helpers/checkUnique";

const multer = require('multer');
const path = require('path');

const repository = AppDataSource.getRepository(Post);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await repository.find({relations: ['category'], order: {createdAt: 'DESC'}});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const product = await repository.findOne({
            where: { postId: parseInt(req.params.id) },
            relations: ['category'],
        });
        product ? res.status(200).json(product) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const create = async (req: any, res: Response, next: NextFunction) => { 
    try {   
        const product = req.body;
        const removeSurroundingQuotes = (value:any) => {
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                return value.slice(1, -1);
            }
            return value;
            };
            Object.keys(product).forEach(key => {
            product[key] = removeSurroundingQuotes(product[key]);
            });

        const images = req.file.key

        const saveData = {
            name: product.name,
            categoryId: product.categoryId,
            description: product.description,
            content: product.content,
            cover: images
        }
        const result = await repository.save(saveData);
        const success = await repository.findOne({where: {postId: result.postId}, relations: ['category']})
        return res.status(200).json(success);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const update = async (req:any, res:Response, next: NextFunction) => {
     
    try {   
        const postId = parseInt(req.params.id);
        const found:any = await repository.findOne({where: {postId: postId}});
        if (!found) return res.sendStatus(410);

        const product = req.body;
        const removeSurroundingQuotes = (value:any) => {
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                return value.slice(1, -1);
            }
            return value;
            };
            Object.keys(product).forEach(key => {
            product[key] = removeSurroundingQuotes(product[key]);
            });

        let images
        if (req.file) images = req.file.key
        const saveData = {...product, cover: images}
        
            console.log(saveData)
     
        Object.assign(found, saveData)
        const result = await repository.save(found);
        const success = await repository.findOne({where: {postId: result.postId}, relations: ['category']})
        return res.status(200).json(success);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ error: "Transaction failed" });
    }
}

const softDelete = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const postId = parseInt(req.params.id);
        console.log(postId);
        const found = await repository.findOneBy({postId: postId})
        if (!found) return res.status(410).json('Product not found');
        await repository.softDelete({postId: postId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const restore = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const postId = parseInt(req.params.id);
        const found = await repository.findOne({where: {postId: postId, deletedAt: Not(IsNull())}, withDeleted: true, })
        if (!found) return res.status(410).json('Product not found');
        await repository.restore({postId: postId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getDeleted = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const products = await repository.find({withDeleted: true, where: {deletedAt: Not(IsNull())}, relations: ['category'], order: {deletedAt: 'DESC'}});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const hardDelete = async (req:Request, res:Response)=>{
    try {
        const postId = parseInt(req.params.id);
        const product = await repository.findOne({withDeleted: true, where: {postId:postId, deletedAt: Not(IsNull())}});
        if (!product) return res.sendStatus(410);
        await repository.delete({postId: postId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const checkProductUnique = async (req: Request, res:Response, next:NextFunction) => {
    const {value, ignore, field} = req.query;
    if(ignore && ignore == value) {
        return res.sendStatus(200)
    }
    
    try {
        const check = await checkUnique(Post, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getByCategory = async (req:Request, res:Response) => {
    try {
        const search = req.query.search
        const searchCondition = search ? { name: Like(`%${search}%`) } : {};

        const {categoryId} = req.params;
        const products = await repository.find({where: {statusId: 41, categoryId: parseInt(categoryId), ...searchCondition}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size'], order: {createdAt: 'DESC'}});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

const client = async (req:Request, res:Response) => {
    try {
        const search = req.query.search
        const searchCondition = search ? { name: Like(`%${search}%`) } : {};

        const products = await repository.find({where: {statusId: 41, ...searchCondition}, relations: ['category'], order: {createdAt: 'DESC'}});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            }); 
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

export default {getAll, getById, create, update, softDelete, restore, hardDelete, getDeleted, checkProductUnique, getByCategory, client}
