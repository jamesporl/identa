import express, { Express, Request, Response } from 'express';
import next from 'next';
import { enableStaticRendering } from 'mobx-react';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './core/trpc';
import { appTrpcRouter } from './core/appTrpcRouter';
import connectToMongo from './core/connectToMongo';
import loadInitialData from './core/loadInitialData';

(async (): Promise<void> => {
  const port = 3000;
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handle = app.getRequestHandler();

  // This is not a react hook. See https://mobx-react.js.org/recipes-ssr
  // eslint-disable-next-line react-hooks/rules-of-hooks
  enableStaticRendering(true);

  await app.prepare();

  await connectToMongo();
  await loadInitialData();

  const server: Express = express();

  server.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appTrpcRouter,
      createContext,
    }),
  );

  server.all('*', (req: Request, res: Response) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
})();

export {};
