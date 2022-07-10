import User from '../models/User';
import File from '../models/File';
import jwt from 'jsonwebtoken';
import { getFileFromS3, checkConection, uploadToS3V2 } from '../libs/s3';

const { validationResult } = require('express-validator');

export const uploadFile = async (req, res) => {

    if (!req.files) {
      return res.status(400).json({message: "No se ha encontrado ningun archivo"});
    }

    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await User.findByIdAndUpdate(decoded.id);

    const file = req.files.file;

    const result = await uploadToS3V2(file);

    const fileNew = new File({
        name: result.Key,
        url: result.Location,
        user: user.id
    });

    const savedFile = await fileNew.save();

    user.files.push(savedFile.id);
    await user.save();

    res.status(200).json({message: "Archivo subido", response: result, file: savedFile});


};

export const downloadFile = async (req, res) => {

    const token = req.headers["token"];
    const nameFile = req.params.name;
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const userFiles = await User.findById(decoded.id).populate('files');
    let isMine = false;

    userFiles.files.forEach(file => {
        if(file.name == nameFile) {
            isMine = true;
        };
    });

    if(!isMine) {
        res.status(404).json({message: "EL archivo no te pertenece"});
    }

    res.attachment(nameFile);
    let fileStream = await getFileFromS3(nameFile);
    fileStream.pipe(res);
};