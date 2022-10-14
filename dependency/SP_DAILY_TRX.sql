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
		ps_bill.BILL_STATUS_IND AS "StatusID",
		fc_bill_setl.SETL_SNO

INTO #TZ
FROM fc_bill_setl, PS_BILL
WHERE FC_BILL_SETL.BILL_NO=ps_bill.bill_no 
AND ps_bill.BILL_STATUS_IND = 5
--AND fc_bill_setl.SETL_SNO = 1 
AND	ps_bill.bill_DT = '2019/12/29'

SELECT * FROM #TZ

DROP TABLE #TZ