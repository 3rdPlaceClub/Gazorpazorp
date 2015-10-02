// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    // debug: true,
    connection: {
      host     : process.env.APP_DB_HOST     || 'pellefant-01.db.elephantsql.com',
      user     : process.env.APP_DB_USER     || 'iahtopiu',
      password : process.env.APP_DB_PASSWORD || 'xuFv8pRYuQ9Huc6Nc6wPnqWy9HHTRIZ0',
      database : process.env.APP_DB_NAME     || 'iahtopiu'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
