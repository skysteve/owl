import { Application } from 'express';
import { getIndex } from './controllers';

export function initRouter(app: Application): void {
  app.get('/', getIndex);
}