import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database";
import { Book } from "../entities/book.entity";
import { handleUniqueError } from "../helpers/handleUniqueError";
import fs from "fs";
import { IsNull, Not, Like } from "typeorm";
import checkUnique from "../helpers/checkUnique";

const multer = require('multer');
const path = require('path');

const repository = AppDataSource.getRepository(Book);

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
            where: { bookId: parseInt(req.params.id) },
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
        const storage = multer.diskStorage({
            contentType: multer.AUTO_CONTENT_TYPE,
            destination: function (req:Request, file:any, cb:Function) {
                if (!fs.existsSync(`./public/uploads/books/`)) {
                    fs.mkdirSync(`./public/uploads/books/`, { recursive: true });
                  }
              return cb(null, `./public/uploads/books/`);
            },
            filename: function (req:any, file:any, cb:any) {
              cb(null, Date.now() + '-' + file.originalname)
              return Date.now() + '-' + file.originalname
            }
        });

        const upload = multer({ storage: storage }).single("file");

        await upload(req, res, async function (err:any) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                try {   
                    const book = req.body;
                    const removeSurroundingQuotes = (value:any) => {
                        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                          return value.slice(1, -1);
                        }
                        return value;
                      };
                      Object.keys(book).forEach(key => {
                        book[key] = removeSurroundingQuotes(book[key]);
                      });

                    let file
                    if (req.file?.filename) file = 'uploads/books/' + req.file?.filename
                    const saveData = {
                        name: book.name,
                        categoryId: book.categoryId,
                        description: book.description,
                        content: book.content,
                        url: file
                    }
                    const result = await repository.save(saveData);
                    const success = await repository.findOne({where: {bookId: result.bookId}, relations: ['category']})
                    return res.status(200).json('success');
                } catch (error:any) {
                    if(error.number == 2627) {
                        const message = handleUniqueError(error);
                        return res.status(400).json({ error: message });
                    }
                    console.log(error);
                    return res.status(500).json({ error: "Transaction failed" });
                }
            }
        });      
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const update = async (req:any, res:Response, next: NextFunction) => {
    try {
        const storage = multer.diskStorage({
            contentType: multer.AUTO_CONTENT_TYPE,
            destination: function (req:Request, file:any, cb:Function) {
                if (!fs.existsSync(`./public/uploads/books/`)) {
                    fs.mkdirSync(`./public/uploads/books/`, { recursive: true });
                  }
              return cb(null, `./public/uploads/books/`);
            },
            filename: function (req:any, file:any, cb:any) {
              cb(null, Date.now() + '-' + file.originalname)
              return Date.now() + '-' + file.originalname
            }
        });

        const upload = multer({ storage: storage }).single("images");

        await upload(req, res, async function (err:any) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                try {   
                    const bookId = parseInt(req.params.id);
                    const found:any = await repository.findOne({where: {bookId: bookId}});
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
                    if (req.file?.filename) images = 'uploads/posts/' + req.file?.filename
                    const saveData = {
                        name: product.name,
                        categoryId: product.categoryId,
                        description: product.description,
                        content: product.content,
                        cover: images
                    }
                    Object.assign(found, saveData)
                    const result = await repository.save(found);
                    const success = await repository.findOne({where: {bookId: result.bookId}, relations: ['category']})
                    return res.status(200).json('success');
                } catch (error:any) {
                    if(error.number == 2627) {
                        const message = handleUniqueError(error);
                        return res.status(400).json({ error: message });
                    }
                    console.log(error);
                    return res.status(500).json({ error: "Transaction failed" });
                }
            }
        });      
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const softDelete = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const bookId = parseInt(req.params.id);
        console.log(bookId);
        const found = await repository.findOneBy({bookId: bookId})
        if (!found) return res.status(410).json('Product not found');
        await repository.softDelete({bookId: bookId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const restore = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const bookId = req.body.bookId
        const found = await repository.findOne({where: {bookId: bookId, deletedAt: Not(IsNull())}, withDeleted: true, })
        if (!found) return res.status(410).json('Product not found');
        await repository.restore({bookId: bookId});
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
        const bookId = parseInt(req.params.id);
        const product = await repository.findOne({withDeleted: true, where: {bookId:bookId, deletedAt: Not(IsNull())}});
        if (!product) return res.sendStatus(410);
        await repository.delete({bookId: bookId});
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
        const check = await checkUnique(Book, `${field}`, value);
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
        const products = await repository.find({where: {categoryId: parseInt(categoryId), ...searchCondition}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size'], order: {createdAt: 'DESC'}});
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

        const products = await repository.find({where: {...searchCondition}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size'], order: {createdAt: 'DESC'}});
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
