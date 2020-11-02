var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'sml12345',
      database: 'bsto',
      multipleStatements: true
    }
})

module.exports = {
    getDB: function() {
        return knex
    }
}