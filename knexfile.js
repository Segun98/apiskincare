require('dotenv').config();

module.exports = {
  development: {
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
    connection: `${process.env.CONNECTION_STRING}?ssl=false`,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds'
    },
  },
};