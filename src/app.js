import Koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'

import mainRouter from './routes/root'
import config from './config'

const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(logger())
app.use(mainRouter.routes())
app.use(mainRouter.allowedMethods())

app.use(async ctx => {
  ctx.body = 'Invalid path'
})

const server = app.listen(config.local.port)
