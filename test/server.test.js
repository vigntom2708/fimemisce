import {} from 'dotenv/config'
import req2server from 'supertest'
import test from 'ava'
import server from './../lib/server'

;(function testRoutes () {
  test.cb('Empty Request: no errors', t => {
    req2server(server).get('/')
      .end((err, res) => {
        t.ifError(err, "Errors aren't allowed")
        t.end()
      })
  })

  test.cb('Empty Request: expect json response', t => {
    req2server(server)
      .get('/')
      .expect('Content-Type', '/json/')
      .expect(200)
      .end((_, res) => {
        t.truthy(res.body)
        t.end()
      })
  })

  test.cb('Requst a form to upload a file: expect json response', t => {
    req2server(server).get('/api/request')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end((_, res) => {
        t.truthy(res.body)
        t.end()
      })
  })
}())
