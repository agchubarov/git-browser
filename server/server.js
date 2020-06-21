import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import Root from '../client/config/root'

import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises

let connections = []

const port = process.env.PORT || 8090
const server = express()

const saveFile = async (users) => {
  return writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: 'utf8' })
}

const readData = async () => {
  return readFile(`${__dirname}/users.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
      await saveFile(users)
      return users
    })
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.use((req, res, next) => {
  res.set('x-skillcrucial-user', 'cf0307ab-c980-41ce-87fb-dca85e379ba6')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
})

server.get('/api/v1/users/', async (req, res) => {
  const users = await readData()
  res.json(users)
})

server.post('/api/v1/users', async (req, res) => {
  const users = await readData()
  const newUser = req.body
  newUser.id = users[users.length - 1].id + 1
  const updatedUsersList = [...users, newUser]
  await unlink(`${__dirname}/users.json`)
  saveFile(updatedUsersList)
  res.json({ status: 'success', id: newUser.id })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const users = await readData()
  const { userId } = req.params
  const newUser = req.body
  const newUserArray = users.map((it) => (it.id === +userId ? Object.assign(it, newUser) : it))
  await unlink(`${__dirname}/users.json`)
  saveFile(newUserArray)
  res.json({ status: 'success', id: +userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const users = await readData()
  const { userId } = req.params
  users.splice(Number(userId) - 1, 1)
  await unlink(`${__dirname}/users.json`)
  saveFile(users)
  res.json({ status: 'success', id: Number(userId) })
})

server.delete('/api/v1/users', async (req, res) => {
  await unlink(`${__dirname}/users.json`)
  // res.json({ status: 'success' })
  res.end()
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
