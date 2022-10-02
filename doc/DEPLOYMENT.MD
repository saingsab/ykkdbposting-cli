## INDRO

### a) Data Flow: 

Stage of data flow from Ms Server to API server.

1. Pulling Data from Daily proceedure SQL server and store it into backup file align by date.
2. Login to API and add token to local storage. 
3. Posting daily transaction from local file to API Server this can be menually or automatically.

### b) Project Structor 
```
├───dbcsv //Backup daily transaction by date and store
├───doc  // Document
└───logs // Events logs
```

#### Detail View
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        01/10/2022     11:30                dbcsv
d-----        01/10/2022     13:08                doc
d-----        26/09/2022     12:32                logs
-a----        01/10/2022     11:59            444 .env
-a----        27/09/2022     13:46             36 .gitignore
-a----        26/09/2022     19:13             42 2022-09-26.csv
-a----        01/10/2022     11:24            867 commands.js
-a----        26/09/2022     12:47            428 dbConfig.js
-a----        26/09/2022     16:59            978 dbOperation.js
-a----        01/10/2022     11:53           2695 getDailyTransaction.js
-a----        01/10/2022     11:58           1382 loginToAPI.js
-a----        30/09/2022     22:23         145860 package-lock.json
-a----        30/09/2022     16:43            629 package.json
-a----        01/10/2022     12:06           1817 postDailyTransaction.js
-a----        01/10/2022     11:36           2923 postData.js
-a----        27/09/2022     19:05            228 README.md
-a----        26/09/2022     14:21            871 toDateFM.js
-a----        01/10/2022     11:35            264 tokens.json

```
### c) Where to read Event log file
```
logs/op.log
```
Above is the event log file. The even jounal is list the specific event at the specifiy date time.

## II Installaing and Deployment

There are few pagacke need to be install before runing the script.
### 1 Dependency 
 - Nodejs version : v16.15.0
 - npm versio: 8.5.5
 initial project by install dependency 
 go to project directory and install 
 npm install 
 npm link 

### 2 Deploy SP Script

  get SP_DAILY_TRX.sql and run on MSSQL server at every db that need to be posted the transaction to API.
  test execute Proceedure

  ```
  use TLJAEON1 
  exec SP_DAILY_TRX 
  @ST_DATE =  '2019/12/14' 
  ``` 

### 3 Environment Confirguration
go and endit .env file 
replace with actual environment configuratio. 
### 4 Test From Command Line
Posting daily sale by: Store, Date, Mall Name, Tenant Name:
```
p TLJAEON1 2019-12-13 CM271MegaMall CM271TheAsianKitchen
```

Showing Transaction by Store and Date.
```
s TLJAEON1 2019-12-12 
```


III Add New Script 

1. script showing daily transaction 
2. script posting daily transaction 
3. create new script for windows environment
