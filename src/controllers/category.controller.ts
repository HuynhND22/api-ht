import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Category } from '../entities/category.entity';
import { IsNull, Not } from 'typeorm';
import checkUnique from '../helpers/checkUnique';
import { handleUniqueError } from '../helpers/handleUniqueError';

const repository = AppDataSource.getRepository(Category);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await repository.find({where: {parent: IsNull()}, order: {createdAt: 'DESC'}, relations: ['children']});
      if (categories.length === 0) {
        return res.status(204).send({
          error: 'No content',
        });
      }
      return res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      category ? res.json(category) : res.status(410);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = new Category();
      Object.assign(category, req.body);
  
      await repository.save(category);
      res.status(201).json(category);
    } catch (error: any) {
      if(error.number == 2627) {
        const message = handleUniqueError(error);
        return res.status(400).json({ error: message });
    }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const update =async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
  
      Object.assign(category, req.body);
      await repository.save(category);
  
      const updatedCategory = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      res.json(updatedCategory);
    } catch (error:any) {
      if(error.number == 2627) {
        const message = handleUniqueError(error);
        return res.status(400).json({ error: message });
    }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const softDelete = async (req: Request, res: Response, next: any) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
      await repository.softDelete({ categoryId: parseInt(req.params.id) });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await repository.find({ withDeleted: true, where: {deletedAt: Not(IsNull()), parent: IsNull() }, order: {deletedAt: 'DESC'}, relations: ['children']});
      if (categories.length === 0) {
        res.status(204).send({
          error: 'No content',
        });
      } else {
        res.json(categories);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const restore = async (req: Request, res: Response, next: any) => {
  const id = parseInt(req.body.categoryId);
  console.log(id);
    try {
      const category = await repository.findOne({ withDeleted: true, where: { categoryId: id, deletedAt: Not(IsNull()) }});
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
      await repository.restore({ categoryId: id });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const hardDelete = async (req: Request, res: Response) => {
  try {
    const category = await repository.findOne({withDeleted: true, where: {categoryId: parseInt(req.params.id), deletedAt: Not(IsNull())} });
    if (!category) {
      return res.status(410).json({ error: 'Not found' });
    }
    await repository.delete({ categoryId: parseInt(req.params.id) });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const checkCategoryUnique = async (req:Request, res:Response) => {
  const {value, ignore, field} = req.query;
  if(ignore && ignore == value) {
    return res.sendStatus(200)
  }

  try {
    const check = await checkUnique(Category, `${field}`, value);
    check ? res.sendStatus(200) : res.sendStatus(400)
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default {getAll, getById, getDeleted, create, update, softDelete, restore, hardDelete, checkCategoryUnique}
