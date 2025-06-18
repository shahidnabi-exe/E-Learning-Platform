import {v4 as uuid} from "uuid";
// uuidv4 is used to generate unique identifiers for uploaded files.
import multer from "multer";
// multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads')
    },
    filename(req, file, cb){
        const id = uuid();

        const extName = file.originalname.split('.').pop();

        const fileName = `${id}.${extName}`;

        cb(null, fileName);
    },
});

export const uploadFiles = multer({ storage }).single('file');