const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ToDateFM = require("./toDateFM");

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

fs.copyFile('dbcsv/out.csv', `dbcsv/${ToDateFM.getOnlyDate()}.csv`, (err) => {
  if (err) throw err;
  console.log('Data was copied to new destination');
});

var db = [];

fs.createReadStream('dbcsv/out.csv')
  .pipe(csv())
  .on('data', (row) => {
    db.push(row);
    // console.log(row);
  })
  .on('end', () => {
    // CAll API Posting here
    // Loop and post one by one
    console.log(db[0].LastName)
    console.log('CSV file successfully processed');
  });