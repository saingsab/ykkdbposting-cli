require("dotenv").config();
const axios = require("axios").default;
const tokens = require("./tokens");
const fs = require("fs");
const toDateFM = require("./toDateFM")

const writeLog = async (local, text) => {
  fs.appendFileSync(local.toString(), text.toString(), function (err) {
       if (err) return console.log(err);
 })
}

var options = {
  method: 'POST',
  url: `${process.env.APIURLLOGIN}`,
  headers: {'Content-Type': 'application/json'},
  data: {userId: `${process.env.APIUSER}`, pwd: `${process.env.APIPASS}`}
};

const loginToAPI = async () => {
    let freshToken = await axios.request(options).then(function (response) {
      writeLog('logs/op.log', `\nSUCCE: Successfully login to API Server:  ${ToDateFM.getOnlyDate()}`);
      return response.data.token;
      }).catch(function (error) {
        writeLog('logs/op.log', `\nERROR: Failed to login to API Server: ${error}: ${ToDateFM.getOnlyDate()}`);
        console.error(error);
      });

    return freshToken;
}

const updateToken = async () => {
    let newToken = {
        token: await loginToAPI()
    }

    fs.writeFileSync (`${process.env.TOKENS}`, JSON.stringify(newToken), err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });
}

module.exports = { updateToken };
