const logger = require('winston')
const http = require('http')
const url = require('url')
const formidable = require('formidable')

const appAddress = process.env.APP_ADDRESS || '<app address>'

function fileUploadResponse (req, res) {
  if (req.method.toLowerCase() === 'post') {
    const form = new formidable.IncomingForm()

    return form.parse(req, (err, fields, files) => {
      if (err) {
        logger.error(err.message)
        res.writeHead(500)
        return res.end(err.message)
      }

      const data = JSON.stringify({
        size: `${req.headers['content-length']} bytes`
      })

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      })

      return res.end(data)
    })
  }

  res.writeHead(200, { 'Content-Type': 'text/html' })

  res.end(
    '<form action="/" enctype="multipart/form-data" method="post">' +
      '<div style="padding: 12px">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="Submit">' +
      '</div>' +
    '</form>'
  )
}

function usageResponse (res) {
  const info = JSON.stringify({
    help: 'Helper message',
    use: `${appAddress}`
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(info)
  })

  return res.end(info)
}

module.exports = http.createServer((req, res) => {
  const route = url.parse(req.url, true)

  if (route.pathname === '/') {
    return fileUploadResponse(req, res)
  }

  return usageResponse(res)
})
