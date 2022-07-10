import express from 'express';
import cors from "cors";
import morgan from 'morgan';
import helmet from "helmet";

import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import info from './docs/basicInfo';

import fileUpload from 'express-fileupload';

import authRoutes from './routes/auth';
import fileRoutes from './routes/file';

// Middlewares
const corsOptions = {
    // origin: "http://localhost:3000",
};

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles:true, tempFileDir:"/tmp" }));

// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(info))); 

// app
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);

export default app;