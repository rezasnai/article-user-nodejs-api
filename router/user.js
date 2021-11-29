const express = require('express')
const userController = require('../controller/user')
const userSchema = require('../middlewares/jsonSchema/user')
const validate = require('../middlewares/validator')
const isAuthorization = require('../middlewares/isAuthorization')
const userRouter = express.Router()

userRouter.post(
  '/register',
  validate(userSchema.register),
  userController.register
)

userRouter.post('/login', validate(userSchema.login), userController.login)

userRouter.get(
  '/articles',
  isAuthorization.verifyToken,
  userController.getArtilcesByUserEmail
)

module.exports = userRouter
