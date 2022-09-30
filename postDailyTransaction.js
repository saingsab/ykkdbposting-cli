const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ToDateFM = require("./toDateFM");
// const postData = require("./postData");

const writeLog = async (local, text) => {
  await fs.appendFile(local.toString(), text.toString(), function (err) {
        if (err) return console.log(err);
  })
}

const csvWriter = createCsvWriter({
  path: `${ToDateFM.getOnlyDate()}.csv`,
  header: [
      {id: 'PersonID', title: 'PersonID'},
      {id: 'LastName', title: 'LastName'},
      {id: 'FirstName', title: 'FirstName'},
      {id: 'Address', title: 'Address'},
      {id: 'City', title: 'City'},
  ]
});

const postDailyTransaction = async () => {

    await fs.copyFile('dbcsv/out.csv', `dbcsv/${ToDateFM.getOnlyDate()}.csv`, (err) => {
      if (err) throw err;
      console.log('Data was copied to new destination');
      //writeLog("logs/op.log", "\nERROR: Data was copied to new destination : " + toDateFM.getFullDateTime()); 
    })
    await writeLog("logs/op.log", `\nSUCCE: Data was copied to new destination ${ToDateFM.getOnlyDate()}`);

  //  await fs.copyFile('dbcsv/out.csv', `dbcsv/${ToDateFM.getOnlyDate()}.csv`, (err) => {
  //   if (err) throw err;
  //   writeLog("logs/op.log", "\nSUCCE: Data was copied to new destination : " + toDateFM.getFullDateTime()) 
  //   console.log('Data was copied to new destination');
  // });
  
  // var db = [];
  
  // fs.createReadStream('dbcsv/out.csv')
  //   .pipe(csv())
  //   .on('data', (row) => {
  //     db.push(row);
  //     // console.log(row);
  //   })
  //   .on('end', () => {
  //     // CAll API Posting here
  //     console.log("Start posting data ...")
  //     // await postData.postData();
  //     console.log(db[0].LastName)
  //     writeLog("logs/op.log", "\nSUCCE: Successfully Posted Transaction to API Server : " + toDateFM.getFullDateTime()) 
  //     console.log('Successfully Posted Transaction to API Server');
  //   });
}

const main = async () => {
    await  postDailyTransaction();
}

main()
    .then( () => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

// module.exports = { postDailyTransaction };