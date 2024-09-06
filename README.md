# jsramverk
Course repo DV1677 BTH
====================
## Kmom01

För att få koden att fungera så gjorde vi två saker:
1. Installerade en dotenv via: npm install dotenv
2. La till en port som alternativ till porten som är definierad enligt miljövariablerna: ``const port = process.env.PORT || 3300;``
3. Migrerade till docs.sqlite via ```sqlite3 docs.sqlite < migrate.sql```. La även till fejkdata . migrate.sql