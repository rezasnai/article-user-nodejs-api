const { Pool } = require('pg')
const quesries = require('./query')

const poolConnection = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'template',
  password: 'root',
  port: 5432,
})

const createTables = async function () {
  try {
    await poolConnection.query(quesries.buildUserTable)
    await poolConnection.query(quesries.buildArticleTable)
    console.log('Tables Created')
  } catch (error) {
    console.log(error)
  }
}

const dropTables = async function () {
  try {
    await poolConnection.query(quesries.dropArticleTable)
    await poolConnection.query(quesries.dropUserTable)
    console.log('Tables Droped')
  } catch (error) {
    console.log(error)
  }
}

// dropTables()
// createTables()

exports.poolConnection = poolConnection
