// pakages
const express = require('express')
const Path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
// another
const corsMiddleware = require('./middlewares/cors')
const config = require('./config')
const utilFunctions = require('./util/functions')
const { poolConnection } = require('./database/db')
const BaseModel = require('./database/BaseModel')
const app = express()
// config
app.use(corsMiddleware)
app.use(express.json())
app.use('/public', express.static(Path.join(__dirname, 'public')))

app.use(helmet())
app.use(compression())

const accessLogStream = fs.createWriteStream(
  Path.join(__dirname, 'access.log'),
  { flags: 'a' }
)
app.use(morgan('combined', { stream: accessLogStream }))

// add router
app.use((req, res, next) => {
  poolConnection
    .connect()
    .then(() => {
      BaseModel.setDataBase(poolConnection)
      next()
    })
    .catch((err) => {
      err.message = 'برقراری ارتباط با دیتابیس امکان پذیر نیست'
      return next(err)
    })
})

const userRouter = require('./router/user')
const articleRouter = require('./router/article')
app.use('/api/user', userRouter)
app.use('/api', articleRouter)
app.use(utilFunctions.get404)
app.use(utilFunctions.erorrHandler)

app.listen(process.env.PORT || 3000, 'localhost', () => {
  console.log(`sevre is running on ${process.env.PORT || 3000}`)
})
