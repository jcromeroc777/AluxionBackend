import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import info from './docs/basicInfo';

// dotenv
dotenv.config({ path: '.env'})

const app = express();

app.use(morgan('dev'));
// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(info))); 

export default app;