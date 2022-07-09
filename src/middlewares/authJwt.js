import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';
import User from '../models/User';

// dotenv
dotenv.config({ path: '.env'});

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["token"];
        if(!token) return res.status(403).json({message: "El token es obligatorio"});

        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

        const user = await User.findById(decoded.id, {password: 0});
        if(!user) return res.status(404).json({message: "El usuario no existe"}); 

        next();
    } catch (error) {
        return res.status(401).json({message: "No autorizado"});
    }
};

export const verifyTokenEmail = async (req, res, next) => {
    try {
        const token = req.headers["token"];
        if(!token) return res.status(403).json({message: "El token es obligatorio"});

        const decoded = jwt.verify(token, process.env.SECRET_KEY_EMAIL);

        const user = await User.findById(decoded.id, {password: 0});
        if(!user) return res.status(404).json({message: "El usuario no existe"}); 

        next();
    } catch (error) {
        return res.status(401).json({message: "No autorizado"});
    }
};

