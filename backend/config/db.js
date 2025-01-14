require('dotenv').config();
const knex = require('knex');

const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

const db = knex(knexConfig);

module.exports = db;
