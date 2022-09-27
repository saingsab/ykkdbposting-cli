const program = require('commander');
const {
   testconnection 
} = require('./app');

program 
    .version('1.0.0')
    .description('Client Posting Dialy Sale')

program.parse(process.argv);