require("dotenv").config();
const fs = require("fs");
const { stringify } = require("csv-stringify");
const config = require("./dbConfig");
const sql = require('mssql/msnodesqlv8');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const toDateFM = require("./toDateFM");

sql.on('error', err => {
    console.log(err.message)
})

const writeLog = async (local, text) => {
      await fs.appendFile(local.toString(), text.toString(), function (err) {
            if (err) return console.log(err);
})
}

const csvWriter = createCsvWriter({
    path: 'dbcsv/out.csv',
    header: [
      {id: 'PersonID', title: 'PersonID'},
      {id: 'LastName', title: 'LastName'},
      {id: 'FirstName', title: 'FirstName'},
      {id: 'Address', title: 'Address'},
      {id: 'City', title: 'City'},
    ]
  });

async function writeFromDB() {

    try {
      // Make a copy first 
        let pool = await sql.connect(config)
        let result1 = await pool.request().query('select * from Persons')
        let log = await writeLog("logs/op.log", "\nSUCCE: The CSV file was written successfully : " + toDateFM.getFullDateTime()) 
        console.log(result1.recordset)

        await csvWriter
        .writeRecords(result1.recordset)
        .then(()=> log);
        sql.close()
    } catch (error) {
        console.log(error)
        sql.close()
    }
}

const main = async () => {
    await writeFromDB();
}

main()
    .then( () => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
