import { Router as ExpressRouter } from 'express';

import type { Middleware } from '.';

export default class Router {
  readonly expressRouter: ExpressRouter;
  readonly routePath: string;

  constructor (routePath: string) {
    if (routePath.startsWith('/') || routePath.endsWith('/')) {
      throw new Error(`Invalid route path ${routePath}`);
    }

    this.expressRouter = ExpressRouter();
    this.routePath = routePath;
  }

  get (path: string, ...middleware: Middleware[]) {
    this.expressRouter.get(path, ...middleware);
  }

  post (path: string, ...middleware: Middleware[]) {
    this.expressRouter.post(path, ...middleware);
  }

  put (path: string, ...middleware: Middleware[]) {
    this.expressRouter.put(path, ...middleware);
  }

  delete (path: string, ...middleware: Middleware[]) {
    this.expressRouter.delete(path, ...middleware);
  }

  patch (path: string, ...middleware: Middleware[]) {
    this.expressRouter.patch(path, ...middleware);
  }
}
