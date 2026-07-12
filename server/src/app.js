import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import corsOptions from './config/cors.js';
import env from './config/env.js';
import apiRoutes from './routes/index.js';
import notFound from './middleware/notFound.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Request logging
app.use(morgan(env.isDev ? 'dev' : 'combined'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorMiddleware);

export default app;
