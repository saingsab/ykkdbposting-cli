const CSVToJSON = require('csvtojson');
const fs = require('fs');
const ToDateFM = require("./toDateFM");
const postData = require("./postData");
const getDailyTransaction = require("./getDailyTransaction");
const loginToAPI = require('./loginToAPI');
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
const pullingData = async () => {
  await CSVToJSON().fromFile('dbcsv/out.csv')
  .then(_tx => {
    tx.push(_tx[0]);
  }).catch(err => {
      console.log(err);
  });
  console.log(Number.parseFloat(tx[0].grossSale).toFixed(2))

}

const postDailyTransaction = async (_storeName, _txDate, _mallName, _tenantName, _posId) => {

  console.log("Backup transaction ...")
  await backupTrx();

  console.log(`Pulling data from ${_storeName} on ${_txDate} transaction ... `)

  await getDailyTransaction.getDailyTransaction(_storeName, _txDate);

  console.log('Deserialize a database from file...');
  await pullingData();

  console.log(`Start login to API Server ...`);
  let _accToken =  await loginToAPI.loginToAPI();
  console.log("Updating Access Token ...");

  console.log("Start posting data ...")
  await postData(
    _mallName,
    _tenantName,
    _txDate,
    Number.parseFloat(tx[0].grossSale).toFixed(4),
    Number.parseFloat(tx[0].taxAmount).toFixed(4),
    Number.parseFloat(tx[0].netSale).toFixed(4),
    Number.parseFloat(tx[0].cashAmountUsd).toFixed(4),
    Number.parseFloat(tx[0].cashAmountRiel).toFixed(4),
    Number.parseFloat(tx[0].creditCardAmount).toFixed(4),
    Number.parseFloat(tx[0].otherAmount).toFixed(2),
    tx[0].totalCreditCardTransaction,
    tx[0].totalTransaction,
    Number.parseFloat(tx[0].depositAmountUsd).toFixed(4),
    Number.parseFloat(tx[0].depositAmountRiel).toFixed(4),
    Number.parseFloat(tx[0].exchangeRate).toFixed(4),
    _posId,
    _accToken
  )
}  

module.exports = { postDailyTransaction };