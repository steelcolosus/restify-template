chmod +x  wait-for-it.sh
echo "waiting for $DB_HOST:$DB_PORT"
./wait-for-it.sh $DB_HOST:$DB_PORT -t 10 -- echo "db is up"
npm run migration:generate -- --n Migration
npm run migration:run
npm run fixtures
npm run start