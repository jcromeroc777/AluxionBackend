import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { verifyToken } from '../middlewares';

const { body } = require('express-validator');

const router = Router();

router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "token, Origin, Content-Type, Accept",

    );
    next();
});

/**
 * @swagger
 * components:
 *  schemas:
 *    File:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Nombre del archivo
 *        url:
 *          type: string
 *          description: Url del archivo 
 *        user:
 *          type: string
 *          description: Id del usuario
 *      required:
 *        - name
 *        - url
 *        - user
 * 
 */


 /**
 * @swagger
 * /api/file/uploadFile:
 *  post:
 *      summary: Cambia la contraseña
 *      tags: [File]
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *        - name: file
 *          in: formData
 *          required: true
 *          description: Archivo a subir.
 *          schema:
 *            type: file
 *      responses:
 *        200:
 *          description: Archivo subido
 *      
 */
router.post('/uploadFile', verifyToken, fileController.uploadFile);

/**
 * @swagger
 * /api/file/downloadFile/{name}:
 *  get:
 *      summary: Descarga el archivo
 *      tags: [File]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *        - name: name
 *          in: path
 *          required: true
 *          description: Archivo a descargar.
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Archivo descargado
 *      
 */
router.get('/downloadFile/:name', verifyToken, fileController.downloadFile);

/**
 * @swagger
 * /api/file/listFiles:
 *  get:
 *      summary: Lista los archivos de un usuario
 *      tags: [File]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *      responses:
 *        200:
 *          description: Lista de archivos
 *      
 */
router.get('/listFiles', verifyToken, fileController.listFiles);


 /**
 * @swagger
 * /api/file/managerFile:
 *  post:
 *      summary: Cambia el nombre de un archivo
 *      tags: [File]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *        - name: body
 *          in: body
 *          required: true
 *          description: Payload.
 *          content:
 *              application/json:
 *          schema:
 *              type: object
 *              required:
 *                  - id
 *                  - newName
 *              properties:
 *                  id:
 *                      type: string
 *                  newName:
 *                      type: string
 *        
 *              
 *      responses:
 *        200:
 *          description: Archivo cambiado
 *      
 */
router.post('/managerFile', verifyToken, body("id").isAlphanumeric(), body("newName").notEmpty(), fileController.managerFile);

/**
 * @swagger
 * /api/file/listImages:
 *  get:
 *      summary: Lista las imagenes de unsplash
 *      tags: [File]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *        - name: body
 *          in: body
 *          required: true
 *          description: Payload.
 *          content:
 *              application/json:
 *          schema:
 *              type: object
 *              required:
 *                  - query
 *                  - page
 *                  - per_page
 *              properties:
 *                  query:
 *                      type: string
 *                  page:
 *                      type: integer
 *                  per_page:
 *                      type: integer
 *      responses:
 *        200:
 *          description: Lista de archivos
 *      
 */
 router.get('/listImages', verifyToken, body("query").notEmpty(), body("page").notEmpty(), body("per_page").notEmpty(), fileController.listImages);

 /**
 * @swagger
 * /api/file/uploadFromUrl:
 *  get:
 *      summary: Lista las imagenes de unsplash
 *      tags: [File]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          description: Token de Acceso.
 *          schema:
 *            type : string
 *        - name: body
 *          in: body
 *          required: true
 *          description: Payload.
 *          content:
 *              application/json:
 *          schema:
 *              type: object
 *              required:
 *                  - url
 *                  - name
 *              properties:
 *                  url:
 *                      type: string
 *                  name:
 *                      type: string
 *      responses:
 *        200:
 *          description: Sube una imagen desde la URL
 *      
 */
  router.post('/uploadFromUrl', verifyToken, body("url").notEmpty(), body("name").notEmpty(), fileController.uploadFromUrl);

export default router;