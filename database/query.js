module.exports.buildUserTable = `CREATE TABLE IF NOT EXISTS users(
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255)
  )`

module.exports.dropUserTable = `DROP TABLE IF EXISTS users`

module.exports.buildArticleTable = `CREATE TABLE IF NOT EXISTS articls(
  id SERIAL PRIMARY KEY,
  title VARCHAR(300),
  content TEXT,
  image_url VARCHAR(300),
  user_email  VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE
  );`

module.exports.dropArticleTable = `DROP TABLE IF EXISTS articls`
