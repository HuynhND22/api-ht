import { NextFunction, Request, Response } from 'express';

import fs from "fs";
const multer = require('multer');
const path = require('path');

const posts = async (req:any, res:Response) => {
  const storage = multer.diskStorage({
      contentType: multer.AUTO_CONTENT_TYPE,
      destination: function (req:Request, file:any, cb:Function) {
          if (!fs.existsSync(`./public/uploads/posts/`)) {
              fs.mkdirSync(`./public/uploads/posts/`, { recursive: true });
            }
        return cb(null, `./public/uploads/posts/`);
      },
      filename: function (req:any, file:any, cb:any) {
        cb(null, Date.now() + '-' + file.originalname)
        return Date.now() + '-' + file.originalname
      }
  });

  const upload = multer({ storage: storage }).array("images", 5);
  await upload(req, res, async function (err:any) {
      if (err) {
          console.log(err);
          return res.status(500).json({ error: "Upload failed" });
      } else {
          try {
              const images = req.files?.map((file:any) => {
                console.log(file?.filename);  
                  return {url: 'http://localhost:9999/uploads/posts/'+file?.filename}
              });
              console.log(images);
              return res.status(200).json(images);
          } catch (error:any) {
              console.log(error);
              return res.status(500).json({ error: "Transaction failed" });
          }
      }
  });
}

export default {posts}
