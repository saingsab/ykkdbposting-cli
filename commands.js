#!/usr/bin/env node

const program = require('commander');
const getDailyTransaction = require("./getDailyTransaction");
const postDailyTransaction = require("./postDailyTransaction");

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

program
    .command('post <store_name> <tx_date> <mall_name> <tenant_name>')
    .alias('p')
    .description('post tx by store and date')
    .action((store_name, tx_date, mall_name, tenant_name) => {
        postDailyTransaction.postDailyTransaction(store_name, new Date(tx_date), mall_name, tenant_name);
    });

program.parse(process.argv);