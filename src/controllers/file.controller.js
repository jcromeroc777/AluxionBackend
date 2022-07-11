import User from '../models/User';
import File from '../models/File';
import jwt from 'jsonwebtoken';
import { getFileFromS3, manageFile, uploadToS3V2, uploadToS3V1 } from '../libs/s3';
import dotenv from 'dotenv';
import axios from 'axios';

const { validationResult } = require('express-validator');

// dotenv
dotenv.config({ path: '.env'});

export const uploadFile = async (req, res) => {

    console.log(req.files);

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
    const isMine = isMineFile(userFiles, nameFile);

    if(!isMine) {
        res.status(404).json({message: "EL archivo no te pertenece"});
    }else {
        res.attachment(nameFile);
        let fileStream = await getFileFromS3(nameFile);
        fileStream.pipe(res);
    }
};

export const listFiles = async (req, res) => {

    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const userFiles = await User.findById(decoded.id).populate('files');

    res.status(200).json({files: userFiles.files});
};

export const managerFile = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const { id, newName } = req.body;

    const userFiles = await User.findById(decoded.id).populate('files');
    const file = await File.findById(id);
    const isMine = isMineFile(userFiles, file.name);

    if(!isMine) {
        res.status(404).json({message: "EL archivo no te pertenece"});
    }

    const newFile = await manageFile(file.name, newName);
    if(newFile) {
        file.name = newName;
        file.url = `https://${process.env.BUCKET_AWS}.s3.amazonaws.com/${newName}`;
    }

    await file.save();

    res.status(200).json({newUrl: file.url});
};

export const listImages = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, page, per_page } = req.body;

    axios({
        method: 'get',
        url: `https://api.unsplash.com/search/photos?page=${page}&per_page=${per_page}&query=${query}&client_id=${process.env.IMAGE_KEY}`
      })
        .then(function (response) {
            res.status(200).json({images: response.data});
        }).catch((error) => {
            return res.status(400).json({ error });
        });
};

export const uploadFromUrl = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { url, name } = req.body;

    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await User.findByIdAndUpdate(decoded.id);

    let blob = null;

    await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      })
        .then(async function (response) {
            blob = await response.data;
        }).catch((error) => {
            return res.status(400).json({ error });
        });

    const result = await uploadToS3V1(blob, `${name}.jpeg`);

    const fileNew = new File({
        name: result.Key,
        url: result.Location,
        user: user.id
    });

    const savedFile = await fileNew.save();

    user.files.push(savedFile.id);
    await user.save();

    res.status(200).json({message: "Archivo subido desde la url", response: result, file: savedFile});
};

function isMineFile (user, name) {
    let isMine = false;
    
    user.files.forEach(file => {
        if(file.name == name) {
            isMine = true;
        };
    });

    return isMine;
};