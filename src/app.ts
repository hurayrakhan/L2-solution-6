import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.js';
import routes from './routes/index.js';

const app: Application = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
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
    message: 'Welcome to MoveInBD API 🏠',
    documentation: '/api-docs',
  });
});


// Swagger API Documentation (matching B7A4)
const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js',
  ],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Central Application Versioned Routes
app.use('/api/v1', routes);

// 404 Not Found Middleware
app.use(notFound);

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
