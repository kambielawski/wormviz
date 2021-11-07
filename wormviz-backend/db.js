const Pool = require('pg').Pool;

const dbConfig = process.env.DOCKER_ENV == 1 ? {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
} : {
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'worm_database',
    host: 'localhost',
    port: 5432,
}

// this connects to the database
const pool = new Pool(dbConfig);

module.exports = pool;