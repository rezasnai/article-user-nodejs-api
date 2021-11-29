module.exports = function validate(schema) {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body)
      req.body = validatedBody
      next()
    } catch (err) {
      err.statuCode = 400
      return next(err)
    }
  }
}
