# jsramverk
Course repo DV1677 BTH
====================
## Kmom01

För att få koden att fungera så gjorde vi tre saker:
1. Installerade en dotenv via: npm install dotenv
2. La till en port som alternativ till porten som är definierad enligt miljövariablerna: ``const port = process.env.PORT || 3300;``
3. Migrerade till docs.sqlite via ```sqlite3 docs.sqlite < migrate.sql```. La även till fejkdata i migrate.sql. Alt. ./db/reset_db.bash (färdig bash-script för att reseta)

### Val av frontend-ramverk

Vårt val av frontend-ramverk föll på React, med TypeScript. Efter lite efterforskningar uppfattar vi detta som attraktivt i arbetslivet för de tjänster som vi har kollat upp, vilket är den främsta anledningen till vårt val.