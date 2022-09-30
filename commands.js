const program = require('commander');
const getDailyTransaction = require("./getDailyTransaction");

program 
    .version('1.0.0')
    .description('Client Posting Dialy Sale')

program
    .command('show <store_name> <tx_date>')
    .alias('s')
    .description('show current store total transaction by date')
    .action( (store_name, tx_date) => {
        getDailyTransaction.getDailyTransaction(store_name, tx_date);
    });

program.parse(process.argv);