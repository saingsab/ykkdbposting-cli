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
    console.log(err);
  }
}

var tx = [];

const postDailyTransaction = async (_storeName, _txDate, _mallName, _tenantName) => {
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
    tx.cashAmount,
    tx.creditCardAmount,
    tx.otherAmount,
    tx.totalCreditCardTransaction,
    tx.totalTransaction,
    tx.depositAmountUsd,
    tx.depositAmountRiel,
    tx.exchangeRate,
    "String" //Current value is String
  )
}  
// mallName: `${process.env.mallName}`,
// tenantName: `${process.env.tenantName}`,
// date: '2022-09-09', //toDateFM.getOnlyDate() To be chang on the production
// grossSale: _grossSale,
//           taxAmount: _taxAmount,
//           netSale: _netSale,
//           cashAmount: _cashAmount,
//           creditCardAmount: _creditCardAmount,
//           otherAmount: _otherAmount,
//           totalCreditCardTransaction: _totalCreditCardTransaction,
//           totalTransaction: _totalTransaction,
//           depositAmountUsd: _depositAmountUsd,
//           depositAmountRiel: _depositAmountRiel,
//           exchangeRate: _exchangeRate,
//           posId: _posId

// const main = async () => {
//     await  postDailyTransaction();
// }

// main()
//     .then( () => process.exit(0))
//     .catch(error => {
//         console.log(error);
//         process.exit(1);
//     });

module.exports = { postDailyTransaction };