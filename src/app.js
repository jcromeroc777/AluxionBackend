import express from 'express';
import cors from "cors";
import morgan from 'morgan';
import helmet from "helmet";

import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import info from './docs/basicInfo';

import authRoutes from './routes/auth';

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

// swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(info))); 

// app
app.use("/api/auth", authRoutes);

export default app;