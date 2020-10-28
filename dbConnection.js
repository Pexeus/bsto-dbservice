var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bsto'
    }
})

module.exports = {
    getDB: function() {
        return knex
    }
}