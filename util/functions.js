module.exports.get404 = (req, res, next) => {
  res.status(400).end('Not Found')
}

module.exports.erorrHandler = (erorr, req, res, next) => {
  erorr.statusCode = erorr.statusCode || 500
  erorr.message = erorr.message || 'ارتباط با سرور برقرار نمیشود'
  res.status(erorr.statusCode).json({ message: erorr.message })
}
