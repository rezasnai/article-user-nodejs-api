const yup = require('yup')

module.exports.register = yup.object().shape({
  first_name: yup.string().required().min(3),
  last_name: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().min(5).max(11).required(),
})

module.exports.login = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).max(11).required(),
})
