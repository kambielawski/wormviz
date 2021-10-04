const Pool = require('pg').Pool;


// this connects to the database
const pool = new Pool({
    user: 'postgres',
    password: process.env.WORMVIZ_POSTGRES_PASSWORD,
    database: 'worm_database',
    host: 'localhost',
    port: 5432,
});

module.exports = pool;