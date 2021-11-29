const jwt = require('jsonwebtoken')
const config = require('../config')
module.exports.verifyToken = async (req, res, next) => {
  const token = req.headers?.['authorization']
  try {
    if (!token) {
      throw new Error()
    }
    const decode = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decode
    next()
  } catch (error) {
    error.message = 'نشست شما به پایان رسیده است لطفا دوباره وارد سایت شوید'
    error.statusCode = 401
    return next(error)
  }
}
