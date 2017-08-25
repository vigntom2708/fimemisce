const logger = require('winston')
const http = require('http')
const url = require('url')
const formidable = require('formidable')

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
    '<form action="/api/request" enctype="multipart/form-data" method="post"' +
    '<input type="text" name="title"><br>' +
    '<input type="file" name="upload" multiple="multiple"><br>' +
    '<input type="submit" value="Upload">' +
    '</form>'
  )
}

function usageResponse (res) {
  const info = JSON.stringify({
    help: 'Helper message',
    use: '<app url>/api/request'
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(info)
  })

  return res.end(info)
}

module.exports = http.createServer((req, res) => {
  const route = url.parse(req.url, true)

  if (route.pathname === '/api/request') {
    return fileUploadResponse(req, res)
  }

  return usageResponse(res)
})