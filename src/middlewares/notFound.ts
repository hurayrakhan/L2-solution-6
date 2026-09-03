import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API Endpoint Not Found',
    errors: [
      {
        path: req.originalUrl,
        message: `The requested URL ${req.originalUrl} was not found on this server.`,
      },
    ],
  });
};

export default notFound;
