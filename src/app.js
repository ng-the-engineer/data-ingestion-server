import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';

import mainRouter from './routes/root';
import config from './config';

const app = new Koa();

app.use(bodyParser());
app.use(logger());
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.use(async (ctx) => {
  ctx.body = 'Invalid path';
});

app.listen(config.local.port, () => {
  console.info(`Server start listening port ${config.local.port}`);
});

