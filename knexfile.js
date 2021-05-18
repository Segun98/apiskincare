require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    debug: false,
    connection: process.env.DB_URL,
    pool: {
      max: 20,
      idleTimeoutMillis: 1000
    },
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds'
    },
  },

  testing: {
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds'
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 20,
      idleTimeoutMillis: 1000
    },
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds'
    },
  },
};