require("dotenv").config();

const config = {
    driver: process.env.DRIVER,
    server: process.env.SRVURL,
    port: process.env.SRVPORT,
    user: process.env.SRVUSER,
    password: process.env.SVRPASS,
    database: process.env.SRVDATABASE,
    option: {
        trustedConnection: true
    },
    connectionTimeout: 150000,
    pool: {
        max: 10,
        min: 0,
    }
};

module.exports = config;