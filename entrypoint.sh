chmod +x  wait-for-it.sh
./wait-for-it.sh db:1433 -t 10 -- echo "db is up"
npm run migration:generate -- --n Migration
npm run migration:run
npm run fixtures
npm run start