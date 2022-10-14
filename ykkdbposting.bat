@ECHO OFF

: Expects a date format of 'YYYY-MM-DD'
set dt=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%
set dt=%dt: =0%

echo Posting Current Date At: %dt%

@REM ykkdbposting-cli p STORE Name, Date, Mall Name, Tenant Name, Post ID
ykkdbposting-cli p TLJAEON1 %dt% CM271MegaMall CM271TheAsianKitchen TAKCMM-P1