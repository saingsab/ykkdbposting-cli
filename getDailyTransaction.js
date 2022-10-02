require("dotenv").config();
const fs = require("fs");
const { stringify } = require("csv-stringify");
const config = require("./dbConfig");
const sql = require('mssql/msnodesqlv8');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const toDateFM = require("./toDateFM");
const date = require("date-and-time");

sql.map.register(Date, sql.Date);

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
      {id: 'grossSale', title: 'grossSale'},
      {id: 'taxAmount', title: 'taxAmount'},
      {id: 'netSale', title: 'netSale'},
      {id: 'cashAmount', title: 'cashAmount'},
      {id: 'creditCardAmount', title: 'creditCardAmount'},
      {id: 'otherAmount', title: 'otherAmount'},
      {id: 'totalCreditCardTransaction', title: 'totalCreditCardTransaction'},
      {id: 'totalTransaction', title: 'totalTransaction'},
      {id: 'depositAmountUsd', title: 'depositAmountUsd'},
      {id: 'depositAmountRiel', title: 'depositAmountRiel'},
    ]
  });

const  getDailyTransaction = async (_currentDB, _txDate) => {
    try {
          let pool = await sql.connect(config)
          /*use TLJAEON1 
          exec SP_DAILY_TRX 
          @TX_DATE = '2019-06-04'*/
          // Select DB
          // let _currentDB = "TLJAEON1";
          await pool.request().query(`use ${_currentDB}`);
          let result1 = await pool.request()
                                  .input('ST_DATE', sql.DateTime, _txDate)
                                  // .output('grossSale', sql.Money)
                                  .execute(`SP_DAILY_TRX`)
          let log = await writeLog("logs/op.log", "\nSUCCE: FN getDailyTransaction Pulling data from DB  : " + toDateFM.getFullDateTime()) 
          console.log(result1.recordset[0])
  
          await csvWriter
          .writeRecords(result1.recordset)
          .then(()=> log);
          sql.close()
      } catch (error) {
          console.log(error)
          await writeLog("logs/op.log", "\nERROR: The CSV file was written successfully : " + error.message + toDateFM.getFullDateTime()) 
          sql.close()
      }
}

module.exports = {getDailyTransaction};

// const main = async () => {
//     await getDailyTransaction("TLJAEON1", "2019-12-14");
// }

// main()
//     .then( () => process.exit(0))
//     .catch(error => {
//         console.log(error);
//         process.exit(1);
//     });