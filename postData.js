require("dotenv").config();
const axios = require("axios").default;
const toDateFM = require("./toDateFM");

const writeLog = async (local, text) => {
    await fs.appendFile(local.toString(), text.toString(), function (err) {
          if (err) return console.log(err);
})

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
                        _posId,
                        _token) => {
    var options = {
        method: 'POST',
        url: `${process.env.APIURLPOSTDATA}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${_token}`
        },
        data: {
          mallName: `${process.env.mallName}`,
          tenantName: `${process.env.tenantName}`,
          date: '2022-09-09', //toDateFM.getOnlyDate() To be chang on the production
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
      
     await axios.request(options).then(function (response) {
        console.log(response.data.message);
        writeLog("logs/op.log", `\nSUCCE: ${response.data.message }` + toDateFM.getFullDateTime()) 

      }).catch(function (error) {
        console.error(error.response.status, error.response.statusText, error.response.data.message);
        await writeLog("logs/op.log", `\nERROR: ${error.response.status, error.response.statusText, error.response.data.message }` + toDateFM.getFullDateTime()); 

      });
    }
}

module.exports = PostData;