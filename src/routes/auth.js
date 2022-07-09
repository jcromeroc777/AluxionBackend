import { Router } from 'express';
const { body, param } = require('express-validator');
import * as authController from '../controllers/auth.controller';
import { verifyToken, verifyTokenEmail } from '../middlewares';


const router = Router();

router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "token, Origin, Content-Type, Accept"
    );
    next();
});

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: Correo
 *        password:
 *          type: string
 *          description: Contraseña 
 *      required:
 *        - email
 *        - password
 * 
 */

/**
 * @swagger
 * /api/auth/signIn:
 *  post:
 *      summary: Loguea al usuario
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: Usuario logueado
 *      
 */
 router.post('/signIn', body('email').isEmail(), body('password').isLength({ min: 4 }), authController.signIn);

/**
 * @swagger
 * /api/auth/signUp:
 *  post:
 *      summary: Agrega un nuevo usuario
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: Usuario creado
 *      
 */
router.post('/signUp', body('email').isEmail(), body('password').isLength({ min: 4 }), authController.signUp);

/**
 * @swagger
 * /api/auth/requestChangePassword/{email}:
 *  post:
 *      summary: Solicita el cambio de contraseña
 *      tags: [User]
 *      parameters:
 *        - name: email
 *          in: path
 *          required: true
 *          description: Email del usuario.
 *          schema:
 *            type : string
 *      responses:
 *        200:
 *          description: Correo enviado
 *      
 */
 router.post('/requestChangePassword/:email', param('email').isEmail(), authController.requestChangePassword);

 /**
 * @swagger
 * /api/auth/changePassword/{password}:
 *  post:
 *      summary: Cambia la contraseña
 *      tags: [User]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Email.
 *          schema:
 *            type : string
 *        - name: password
 *          in: path
 *          required: true
 *          description: Nueva contraseña.
 *          schema:
 *            type : string
 *      responses:
 *        200:
 *          description: Usuario creado
 *      
 */
router.post('/changePassword/:password', verifyTokenEmail, authController.changePassword);

export default router;