require('dotenv').config({ path: './data/.env' });

const express = require('express');
const app = express();
const { Pool } = require('pg');


const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGHOSTNUM
     } = process.env 

const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: PGHOSTNUM,
    ssl: {
        require: true,
    } 
});