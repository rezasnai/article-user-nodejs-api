const userModel = require('../model/user')
const articleModel = require('../model/article')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config')

module.exports.register = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.insert([first_name, last_name, email, hashedPassword])
    const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
      expiresIn: '2D',
    })
    res.status(200).json({ message: 'حساب کاربری جدید ایجاد شد', token })
  } catch (err) {
    if (err.code == 23505) {
      err.statuCode = 400
      err.message = 'این کاربر وجود دارد'
    }
    return next(err)
  }
}

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userModel.getByPk(email)
    if (
      user.rowCount == 0 ||
      !(await bcrypt.compare(password, user.rows[0].password))
    ) {
      const err = new Error('کلمه عبور یا نام کاربری اشتباه است')
      err.statuCode = 403
      throw err
    }
    const token = jwt.sign({ email }, process.env.TOKEN_KEY, {
      expiresIn: '2D',
    })
    res.status(200).json({ message: 'ورود با موفقیت انجام شد', token })
  } catch (error) {
    return next(error)
  }
}

module.exports.getArtilcesByUserEmail = async (req, res, next) => {
  try {
    const user = req.user
    const results = await articleModel.getByFk(user.email)
    const data = results.rowCount > 0 ? results.rows : []
    res.status(200).json({ data, count: data.length })
  } catch (error) {
    return next(error)
  }
}
