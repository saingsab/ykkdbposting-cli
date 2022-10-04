const CSVToJSON = require('csvtojson');
const fs = require('fs');
const ToDateFM = require("./toDateFM");
const postData = require("./postData");
const getDailyTransaction = require("./getDailyTransaction");
const date = require('date-and-time')

const writeLog = async (local, text) => {
   fs.appendFileSync(local.toString(), text.toString(), function (err) {
        if (err) return console.log(err);
  })
}

const backupTrx = async () => {
  try {
    fs.copyFileSync('dbcsv/out.csv', `dbcsv/${ToDateFM.getOnlyDate()}.csv`);
    writeLog('logs/op.log', `\nSUCCE: Data was copied to new destination ${ToDateFM.getOnlyDate()}`);
    console.log('Data was copied to new destination');
  }
  catch (err) {
    writeLog('logs/op.log', `\nERROR: FN backupTrx Data was was not copied to new destination ${err } :  ${ToDateFM.getOnlyDate()}`);
    console.log(err);
  }
}

var tx = [];

const postDailyTransaction = async (_storeName, _txDate, _mallName, _tenantName, _posId) => {
  await CSVToJSON().fromFile('dbcsv/out.csv')
  .then(_tx => {
    tx.push(_tx[0]);
  }).catch(err => {
      console.log(err);
  });
  console.log("Backup transaction ...")
  await backupTrx();

  console.log(`Pulling data from ${_storeName} on ${_txDate} transaction ... `)
  await getDailyTransaction.getDailyTransaction(_storeName, _txDate);

  console.log("Start posting data ...")
  await postData(
    _mallName,
    _tenantName,
    _txDate,
    tx.grossSale,
    tx.taxAmount,
    tx.netSale,
    tx.cashAmountUsd,
    tx.cashAmountRiel,
    tx.creditCardAmount,
    tx.otherAmount,
    tx.totalCreditCardTransaction,
    tx.totalTransaction,
    tx.depositAmountUsd,
    tx.depositAmountRiel,
    tx.exchangeRate,
    _posId
  )
}  

module.exports = { postDailyTransaction };