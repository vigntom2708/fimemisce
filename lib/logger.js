const winston = require('winston')
const fs = require('fs')

const nodeEnv = process.env.NODE_ENV || 'development'
const logLevel = process.env.LOG_LEVEL || 'info'
const logDir = './log'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

function logger (env) {
  const timestamp = () => (new Date()).toLocaleString()
  const setupTransports = transports => {
    winston.configure({ transports })
    return winston
  }

  const consoleTransport = new (winston.transports.Console)({
    timestamp,
    colorize: true
  })

  const fileTransport = new (winston.transports.File)({
    filename: `${logDir}/${nodeEnv}.log`,
    timestamp,
    level: logLevel,
    json: false
  })

  if (env === 'production') { return setupTransports([fileTransport]) }
  if (env === 'test') { return setupTransports([consoleTransport]) }

  return setupTransports([consoleTransport, fileTransport])
}

module.exports = logger(nodeEnv)
