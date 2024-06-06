const express = require('express')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const knex = require('../data/db-config')

const server = express()

server.use(session({
  name: 'chocolatechip',
  secret: 'keep it secret, keep it safe!',
  saveUninitialized: false,
  resave: false,
  store: new KnexSessionStore({
    knex,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
}))

server.use(express.json())

const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.json({ api: 'up' })
})

module.exports = server
