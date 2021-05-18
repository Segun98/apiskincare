const {
    Pool
} = require('pg')

const prodConnection = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: 20,
    idleTimeoutMillis:1000,
    ssl: {
        rejectUnauthorized: false
    }
})

const devConnection = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    max: 20,
    idleTimeoutMillis:1000,

})
module.exports = process.env.NODE_ENV === "production" ? prodConnection : devConnection