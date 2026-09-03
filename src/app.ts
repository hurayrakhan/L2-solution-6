import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import sendResponse from './utils/sendResponse';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

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

// Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'B7A6 Backend REST Server is running smoothly!',
    data: {
      status: 'active',
      timestamp: new Date().toISOString(),
    },
  });
});

// Global Error Handler & 404 Route
app.use(globalErrorHandler);
app.use(notFound);

export default app;
