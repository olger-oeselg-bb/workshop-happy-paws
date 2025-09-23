const pino = require('pino')

const isDev = process.env.NODE_ENV !== 'production'

const options = isDev
  ? {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' }
      }
    }
  : { level: process.env.LOG_LEVEL || 'info' }

const logger = pino(options)

module.exports = logger
