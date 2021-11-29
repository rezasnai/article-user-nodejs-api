const config = require('../config')
const fs = require('fs')
const Path = require('path')
const articleModel = require('../model/article')
const articleJsonSchema = require('../middlewares/jsonSchema/article')
// config multer
const multer = require('multer')
const diskStorge = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user
    const path = Path.join('public', 'upload', 'images', 'articles', user.email)
    if (fs.existsSync(path)) {
      cb(null, path)
    } else {
      fs.mkdirSync(path)
      cb(null, path)
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/png'
  )
    cb(null, true)
  else cb(null, false)
}

module.exports.uploadArticleImage = multer({
  storage: diskStorge,
  fileFilter,
  limits: {
    fileSize: 1024000,
  },
}).single('image')

module.exports.newArticle = async (req, res, next) => {
  const image = req.file
  if (!image) {
    const err = new Error('لطفا یک عکس انتخاب کنید')
    err.statusCode = 400
    return next(err)
  }
  try {
    const validatedBody = await articleJsonSchema.newArticle.validate(req.body)
    const result = await articleModel.insert([
      validatedBody.title,
      validatedBody.content,
      '/' + image.path,
      req.user.email,
    ])
    const newArticle = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      image_url: result.rows[0].image_url,
    }
    res.status(200).json({ newArticle })
  } catch (error) {
    fs.unlink(image.path, () => {
      return next(error)
    })
  }
}

module.exports.articles = async (req, res, next) => {
  try {
    const results = await articleModel.getAll()
    const data = results.rows.length <= 0 ? [] : results.rows
    res.status(200).json({ data, count: data.length })
  } catch (error) {
    return next(error)
  }
}

module.exports.articleById = async (req, res, next) => {
  try {
    const article_id = req.query.article_id
    const result = await articleModel.getByPk(article_id)
    if (result.rowCount <= 0) {
      const err = new Error('مقاله ای با این ایدی وجود ندارد')
      err.statusCode = 404
      throw err
    }
    res.status(200).json({ data: result.rows[0] })
  } catch (error) {
    return next(error)
  }
}

module.exports.removeArticle = async (req, res, next) => {
  try {
    const article_id = req.query.article_id
    const result = await articleModel.deleteByPk(article_id)
    if (result.rowCount <= 0) {
      const err = new Error('مقاله ای با این ایدی وجود ندارد')
      err.statusCode = 404
      throw err
    }
    const path = result.rows[0].image_url
    fs.unlink(Path.join(config.ROOT, path), function () {
      res.status(200).json({ message: `مقاله با ایدی ${article_id} حذف گردید` })
    })
  } catch (error) {
    return next(error)
  }
}

module.exports.updateArticle = async (req, res, next) => {
  const body = req.body
  const image = req.file
  const article_id = req.query.article_id
  if (!article_id) {
    const err = new Error('برای بروزرسانی مقاله لطفا ایدی انرا مشخص کنید')
    err.statusCode = 404
    throw err
  }
  try {
    const newArticle = {}
    let error = null
    if (body.title) {
      if (typeof body.title == 'string' && body.title.length > 10)
        newArticle.title = body.title
      else error = new Error('تیتر مقاله باید حداقل 10 کاراکتر باشد')
    }
    if (body.content) {
      if (typeof body.content == 'string' && body.body.content > 40)
        newArticle.content = body.content
      else error = new Error('متن مقاله باید حداقل 40 کاراکتر باشد')
    }
    if (image) newArticle.image_url = image.path
    if (error) {
      error.statusCode = 404
      throw error
    }
    const oldArticle = await articleModel.getByPk(article_id)
    const oldImageArticlePath = oldArticle.rows[0].image_url
    const result = await articleModel.updateByPk(article_id, newArticle)
    if (result.rowCount <= 0) {
      const err = new Error('مقاله ای با این ایدی وجود ندارد')
      err.statusCode = 404
      throw err
    }
    fs.unlink(Path.join(config.ROOT, oldImageArticlePath), function (err) {
      res
        .status(200)
        .json({ message: `مقاله با ایدی ${article_id} بروزرسانی گردید` })
    })
  } catch (error) {
    if (image) {
      fs.unlink(Path.join(config.ROOT, image.path), (err) => {
        return next(error)
      })
    } else {
      return next(error)
    }
  }
}
