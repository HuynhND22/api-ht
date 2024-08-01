import { Response } from 'express';
require('dotenv').config();

const posts = async (req:any, res:Response) => {
  try {
    const file = req.file;
    if (file) {
      return res.json({url: `${process.env.R2_PUBLIC_BUCKET}/${file.key}`});
    }
  } catch (error) {
    res.status(400).json({message: error});
  }
}

export default {posts}
