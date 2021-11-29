const yup = require('yup')

module.exports.newArticle = yup.object().shape({
  title: yup.string().required().min(10),
  content: yup.string().required().min(40),
})
