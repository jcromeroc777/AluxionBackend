import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { verifyToken } from '../middlewares';

const router = Router();

router.post('/uploadFile', verifyToken, fileController.uploadFile);

export default router;