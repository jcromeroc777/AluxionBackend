import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import sendEmail from './../libs/mailer';

// dotenv
dotenv.config({ path: '.env'});

const { validationResult } = require('express-validator');

export const signUp = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const userExist = await User.findOne({email});

    if(userExist) return res.status(400).json({message: "El usuario ya existe"});

    const user = new User({
        email,
        password: await User.encryptPassword(password)
    });

    const savedUser = await user.save();

    const token = jwt.sign({id: savedUser._id}, process.env.SECRET_KEY_JWT, {
        expiresIn: 86400 // 24 horas 
    });

    res.status(200).json({token});
};

export const signIn = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({id: userFound._id}, process.env.SECRET_KEY_JWT, {
        expiresIn: 86400 // 24 horas 
    });

    res.status(200).json({token});
};

export const requestChangePassword = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.params.email;

    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const token = jwt.sign({id: userFound._id}, process.env.SECRET_KEY_EMAIL, {
        expiresIn: 86400 // 24 horas 
    });

    const html = `
        <p>Se ha solicitado cambiar tu contraseña</p>
        <p>Tu link de recuperacion es: urlfront?token=${token}</p>
        <p>Si no has solicitado cambiar tu contraseña haz caso omiso a este correo</p>

    `;

    sendEmail(process.env.EMAIL_API, userFound.email, "Recuperar contraseña", html);

    res.status(200).json({message: "Correo enviado"});
};

export const changePassword = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const password = req.params.password;
    const token = req.headers["token"];

    const decoded = jwt.verify(token, process.env.SECRET_KEY_EMAIL);
    const user = await User.findByIdAndUpdate(decoded.id, {password: await User.encryptPassword(password)});
    if(!user) return res.status(404).json({message: "El usuario no existe"});

    res.status(200).json({message: "Contraseña cambiada"});
};