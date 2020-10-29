var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bsto',
      multipleStatements: true
    }
})

module.exports = {
    getDB: function() {
        return knex
    }
}