import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/data', async (ctx) => {
  ctx.body = {
    'success': 'ok'
  }
})

router.put('/data', async (ctx) => {
  ctx.body = {
    'message': 'Not implemented yet'
  }
})

module.exports = router