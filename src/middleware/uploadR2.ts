require('dotenv').config();
var multer  = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');


aws.config.update({
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
})
const s3 = new aws.S3({
    endpoint: process.env.R2_ENDPOINT,
    signatureVersion: 'v4',
    });
const myBucket = process.env.R2_BUCKET;
const storeUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: myBucket,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req:any, file:any, cb:any) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
}).single('image');

export const uploadR2 = storeUpload;