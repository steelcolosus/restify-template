#!/bin/bash

# wait for MSSQL server to start
export STATUS=1
i=0

while [[ $STATUS -ne 0 ]] && [[ $i -lt 30 ]]; do
	i=$i+1
	sqlcmd -t 1 -U sa -P $SA_PASSWORD -Q "select 1" >> /dev/null
	STATUS=$?
done

if [ $STATUS -ne 0 ]; then 
	echo "Error: MSSQL SERVER took more than thirty seconds to start up."
	exit 1
fi

echo "======= MSSQL SERVER STARTED ========" | tee -a ./config.log

echo "creating database with password $SA_PASSWORD..."

# run the init script to create the DB and the tables in /table
sqlcmd -S localhost  -U SA -P $SA_PASSWORD -d master -i ./setup.sql

echo "======= MSSQL CONFIG COMPLETE =======" | tee -a ./config.log