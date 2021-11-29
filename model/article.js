const BaseModel = require('../database/BaseModel')

class ArticleModel extends BaseModel {
  constructor() {
    super(
      'articls',
      ['title', 'content', 'image_url', 'user_email'],
      'id',
      'user_email'
    )
  }
}

const article = new ArticleModel()

module.exports = article
