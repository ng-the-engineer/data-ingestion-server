import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/data', async (ctx) => {
  ctx.body = {
    'success': 'ok'
  }
})

module.exports = router