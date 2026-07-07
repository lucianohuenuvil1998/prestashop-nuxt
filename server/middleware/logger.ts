import { defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler((event) => {
  const start = Date.now()
  const { pathname } = getRequestURL(event)
  const method = event.method

  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    const status = event.node.res.statusCode
    console.log(`[${method}] ${pathname} → ${status} (${duration}ms)`)
  })
})
