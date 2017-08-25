const throng = require('throng')

const workers = process.env.WEB_CONCURRENCY || 1

throng({
  workers,
  start (id) {
    const server = require('./lib/server')
    const logger = require('./lib/logger')
    const port = process.env.PORT || 5000

    logger.info(`Starting worker with id: ${id}`)

    process.on('SIGTERM', () => {
      logger.info(`Worker ${id} exiting`)
      process.exit()
    })

    server.listen(port).on('error', (e, socket) => {
      logger.info('ERROR: ', e.message)
      socket.end('HTTP/1.1 400 Bad Request')
    })
  }
})
