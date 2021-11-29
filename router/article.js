const express = require('express')
const articleController = require('../controller/article')
const isAuthorization = require('../middlewares/isAuthorization')

const articleRouter = express.Router()
articleRouter.post(
  '/newArticle',
  isAuthorization.verifyToken,
  articleController.uploadArticleImage,
  articleController.newArticle
)

articleRouter.get('/articles', articleController.articles)

articleRouter.get('/article', articleController.articleById)

articleRouter.delete(
  '/article',
  isAuthorization.verifyToken,
  articleController.removeArticle
)

articleRouter.patch(
  '/article',
  isAuthorization.verifyToken,
  articleController.uploadArticleImage,
  articleController.updateArticle
)

module.exports = articleRouter
