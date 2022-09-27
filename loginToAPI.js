require("dotenv").config();
const axios = require("axios").default;
const tokens = require("./tokens");
const fs = require("fs");

var options = {
  method: 'POST',
  url: `${process.env.APIURLLOGIN}`,
  headers: {'Content-Type': 'application/json'},
  data: {userId: `${process.env.APIUSER}`, pwd: `${process.env.APIPASS}`}
};

const loginToAPI = async () => {
    let freshToken = await axios.request(options).then(function (response) {
        return response.data.token;
      }).catch(function (error) {
        console.error(error);
      });

    return freshToken;
}

const updateToken = async () => {
    let newToken = {
        token: await loginToAPI()
    }

    await fs.writeFileSync (`${process.env.TOKENS}`, JSON.stringify(newToken), err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    });
}

module.exports = updateToken;

// const main = async () => {
//    await updateToken();
// }

// main()
//     .then( () => process.exit(0))
//     .catch(error => {
//         console.log(error);
//         process.exit(1);
//     });
