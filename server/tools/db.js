const { Pool } = require('pg');

require('dotenv').config({ path: './data/.env' });
//postgres connection for neons database
const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGPORT
     } = process.env //destructuring
console.log(PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT);
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: PGPORT,
    ssl: {
        require: true,
        rejectUnauthorized: false 
    } 
});

module.exports = pool;