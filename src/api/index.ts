import Router from './Router';
import API from './API';

import type { Request, Response } from 'express';

export {
  Router,
  API
};

export type Middleware = (req: Request, res: Response, next: () => void) => void;
