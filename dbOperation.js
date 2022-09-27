var config = require('./dbConfig');
const sql = require('mssql/msnodesqlv8');
const fs = require("fs");
const toDateFM = require("./toDateFM");

sql.on('error', err => {
    console.log(err.message)
})

const writeLog = (local, text) => {
    fs.appendFile(local.toString(), text.toString(), function (err) {
        if (err) return console.log(err);
    })
}

async function getQ() {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request().query('select * from Persons')
        console.log(result1.recordset.length)
        await writeLog("log/op.log", "SUCCESS: Query has successfully written at" + toDateFM.getFullDateTime );
        sql.close()
    } catch (error) {
        console.log(error)
        sql.close()
    }
}

const main = async () => {
    await getQ();
}

main()
    .then( () => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });