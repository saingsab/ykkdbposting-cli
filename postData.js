require("dotenv").config();
const axios = require("axios").default;
const fs = require('fs');
const toDateFM = require("./toDateFM");
const loginToAPI = require("./loginToAPI");
const tokens = require("./tokens");

const writeLog = async (local, text) => {
  fs.appendFileSync(local.toString(), text.toString(), function (err) {
       if (err) return console.log(err);
 })
}

const PostData = async (_grossSale,
                        _taxAmount, 
                        _netSale, 
                        _cashAmount, 
                        _creditCardAmount, 
                        _otherAmount, 
                        _totalCreditCardTransaction, 
                        _totalTransaction, 
                        _depositAmountUsd, 
                        _depositAmountRiel, 
                        _exchangeRate,  
                        _posId) => {
    var options = {
        method: 'POST',
        url: `${process.env.APIURLPOSTDATA}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.token}`
        },
        data: {
          mallName: `${process.env.mallName}`,
          tenantName: `${process.env.tenantName}`,
          date: '2022-09-12', //toDateFM.getOnlyDate() To be chang on the production
          grossSale: _grossSale,
          taxAmount: _taxAmount,
          netSale: _netSale,
          cashAmount: _cashAmount,
          creditCardAmount: _creditCardAmount,
          otherAmount: _otherAmount,
          totalCreditCardTransaction: _totalCreditCardTransaction,
          totalTransaction: _totalTransaction,
          depositAmountUsd: _depositAmountUsd,
          depositAmountRiel: _depositAmountRiel,
          exchangeRate: _exchangeRate,
          posId: _posId
        }
      };
     await loginToAPI.updateToken();
     console.log("Updating Access Token ...")
     await axios.request(options).then(function (response) {
       
        writeLog("logs/op.log", `\nSUCCE: ${response.data.message } ` + toDateFM.getFullDateTime());
        console.log(response.data.message);

      }).catch(function (error) {
        // console.error(error);
         writeLog("logs/op.log", `\nERROR: ${error.response.status, error.response.statusText, error.response.data.message } ` + toDateFM.getFullDateTime()); 
         console.error(error.response.status, error.response.statusText, error.response.data.message);
      });
}

module.exports = PostData;
// const main = async () => {
//   await  PostData();
//   // await  readCSV();
// }

// main()
//   .then( () => process.exit(0))
//   .catch(error => {
//       console.log(error);
//       process.exit(1);
//   });