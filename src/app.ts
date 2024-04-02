import json from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';

import logger from './logger/logger';
import authRouter from './routes/authRouter';
import cartRouter from './routes/cartRouter';
import productsRouter from './routes/productsRouter';

const app = express();

app.use(json());
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

/**
 * Health check.
 */
app.get('/', (req: Request, res: Response) => {
  res.send("I'm Alive!!");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

export default app;
