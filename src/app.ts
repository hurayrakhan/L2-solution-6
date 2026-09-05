import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.js';
import routes from './routes/index.js';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errors: [{ path: '', message: 'Rate limit exceeded' }],
  },
});
app.use('/api', limiter);

// Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base API route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to MoveInBD Backend REST API Server 🏠🚚',
  });
});

// Central Application Versioned Routes
app.use('/api/v1', routes);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// 404 Not Found Middleware
app.use(notFound);

export default app;
