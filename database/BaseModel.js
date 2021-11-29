/** @format */
let db = null
module.exports = class Database {
  table
  primaryKey
  foreginKey
  properties

  constructor(table, properties, primaryKey, foreginKey = null) {
    this.table = table
    this.properties = properties
    this.primaryKey = primaryKey
    this.foreginKey = foreginKey
  }

  static setDataBase(database) {
    db = database
  }

  getTemplate() {
    const length = this.properties.length
    let template = ''
    for (let idx = 1; idx <= length; idx++) {
      template += `$${idx},`
    }
    return template.slice(0, -1)
  }

  getTemplateForUpdate(obj) {
    return Object.keys(obj)
      .map((key, idx) => `${key} = $${idx + 1}`)
      .join(',')
  }

  insert(data) {
    const query = `INSERT INTO ${this.table}(${this.properties.join(',')})
    VALUES(${this.getTemplate()}) RETURNING *;`
    return db.query(query, data)
  }

  getAll() {
    const query = `SELECT * FROM ${this.table}`
    return db.query(query)
  }

  getByPk(pk) {
    const query = `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`
    return db.query(query, [pk])
  }

  getByFk(fk) {
    const query = `SELECT * FROM ${this.table} WHERE ${this.foreginKey} = $1`
    console.log(query)
    return db.query(query, [fk])
  }

  deleteByPk(pk) {
    const query = `DELETE FROM ${this.table} WHERE ${this.primaryKey} = $1 RETURNING *;`
    return db.query(query, [pk])
  }

  updateByPk(pk, data) {
    const query = `UPDATE ${this.table} SET ${this.getTemplateForUpdate(
      data
    )} WHERE ${this.primaryKey} = $3 RETURNING *;`
    return db.query(query, [...Object.values(data), pk])
  }
} //end of database class
