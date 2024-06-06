const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')

const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')

router.post('/register', checkPasswordLength, checkUsernameFree, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const newUser = await Users.add({ username, password: hash })
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
})

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { password } = req.body
    if (bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user
      res.status(200).json({ message: `Welcome ${req.user.username}!` })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: "Failed to logout" })
      } else {
        res.status(200).json({ message: "logged out" })
      }
    })
  } else {
    res.status(200).json({ message: "no session" })
  }
})


module.exports = router
