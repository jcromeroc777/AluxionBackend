import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { verifyToken } from '../middlewares';

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

export default router;