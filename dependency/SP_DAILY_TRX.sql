/*
Name: SP_DAILY_TRX
Author: Ayoung
CRATE_AT: 28-SEP-2022
MODIFIED_AT:04-OCT-2022
CREATE or ALTER PROCEDURE
*/
ALTER PROCEDURE [dbo].[SP_DAILY_TRX]
@TX_DATE VARCHAR(10)
AS
DECLARE @grossSale MONEY,
		@taxAmount MONEY,
		@netSale MONEY,
		@cashAmountUsd MONEY,
		@cashAmountRiel MONEY,
		@creditCardAmount MONEY,
		@otherAmount MONEY,
		@totalCreditCardTransaction DECIMAL,
		@totalTransaction DECIMAL, 
		@depositAmountUsd MONEY, --0.00 by default
		@depositAmountRiel MONEY, --0.00 by default
		@exchangeRate MONEY

--SET @TX_DATE = (SELECT CAST(@ST_DATE AS DATE))

SELECT	ps_bill.BILL_AMT AS grossSale,
		ps_bill.TAXES AS taxAmount,
		ps_bill.bill_value-ps_bill.DISC_AMT AS netSale,
		ISNULL (FC_BILL_SETL.FORN_AMT,0) AS cashAmountUsd,
		ISNULL (FC_BILL_SETL.SETL_AMT,0) AS cashAmountRiel,
		CASE 
			WHEN fc_bill_setl.SETL_MODE_ID = 1 THEN 1
		END cashAmount,
		CASE 
			WHEN fc_bill_setl.SETL_MODE_ID = 2 THEN 2
		END creditCardAmount,
		CASE 
			WHEN fc_bill_setl.SETL_MODE_ID != 2 AND fc_bill_setl.SETL_MODE_ID != 1 THEN fc_bill_setl.SETL_MODE_ID
		END otherAmount,
		ps_bill.bill_DT AS txDate,
		fc_bill_setl.SETL_MODE_ID AS PaymentMethodID,
		CAST (isnull (fc_bill_setl.CURRENCY_ID,'KHR') AS NVARCHAR) AS CURRENCY_ID,
		ISNULL (fc_bill_setl.CONV_RATE,1) AS exchangeRate,
		ps_bill.BILL_STATUS_IND AS "StatusID"

INTO #TZ
FROM fc_bill_setl, PS_BILL
WHERE FC_BILL_SETL.BILL_NO=ps_bill.bill_no 
AND ps_bill.BILL_STATUS_IND = 5
AND fc_bill_setl.SETL_SNO = 1 
AND	ps_bill.bill_DT = '2019-06-01' --@TX_DATE 

SET @exchangeRate = (SELECT MAX(exchangeRate) AS exchangeRate FROM #TZ) 
SET @grossSale	= ((SELECT SUM(grossSale) AS grossSale  FROM #TZ) / @exchangeRate)
SET @taxAmount	= ((SELECT SUM(taxAmount) AS taxAmount  FROM #TZ) / @exchangeRate)
SET @netSale	= ((SELECT SUM(netSale) AS netSale  FROM #TZ) / @exchangeRate)
SET @cashAmountUsd = ((SELECT SUM(cashAmountRiel) AS cashAmountUsd FROM #TZ
					  WHERE CURRENCY_ID = 'USD'
					  AND PaymentMethodID = 8) / @exchangeRate)
SET @cashAmountRiel = (SELECT SUM(cashAmountRiel) AS cashAmountRiel FROM #TZ
					   WHERE CURRENCY_ID = 'KHR'
					   AND PaymentMethodID = 1)
-- Credit Card Amount = Total Gross Sale where PaymentID = 2 and / echangeRate
SET @creditCardAmount			= (ISNULL((SELECT SUM(grossSale) AS creditCardAmount FROM #TZ 
								  WHERE PaymentMethodID = 2), 0) / @exchangeRate)
-- OtherAmount = paymentMethodID =! 1 and 2 
-- if CURRENCY_ID KHR then / exchangeRate
-- if CURRENCY_ID USD then leave same amount
--- end with sum those two variables.
SET @otherAmount = ((SELECT SUM(cashAmountRiel) AS cashAmountUsd FROM #TZ
				  WHERE PaymentMethodID != 8
				  AND PaymentMethodID != 2
				  AND PaymentMethodID != 1) / @exchangeRate)

SET @totalCreditCardTransaction = (SELECT COUNT(grossSale) AS totalCreditCardTransaction FROM #TZ 
								  WHERE PaymentMethodID = 2)
SET @totalTransaction = (SELECT COUNT(grossSale) AS totalTransaction FROM #TZ)
SET @depositAmountUsd = 0 
SET @depositAmountRiel = 0

SELECT  @grossSale					AS grossSale,
		@taxAmount					AS taxAmount,
		@netSale					AS netSale,
		@cashAmountUsd				AS cashAmountUsd,
		@cashAmountRiel				AS cashAmountRiel,
		@creditCardAmount			AS creditCardAmount,
		@otherAmount				AS otherAmount,
		@totalCreditCardTransaction AS totalCreditCardTransaction,
		@totalTransaction			AS totalTransaction, 
		@depositAmountUsd			AS depositAmountUsd,
		@depositAmountRiel			AS depositAmountRiel,
		@exchangeRate				AS exchangeRate

DROP TABLE #TZ
GO