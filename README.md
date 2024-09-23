# jsramverk
Course repo DV1677 BTH
====================
## Installera och köra
För att installera och köra projektet, när det är nedladdat kör följande kommandon:

Backend:
```
cd ssr-editor-0.1
npm install
nodemon run ssr-editor-0.1/src/server.mjs
```

Frontend:
```
cd frontend
npm install
nodemon start
```


## Kmom01

För att få koden att fungera så gjorde vi tre saker:
1. Installerade en dotenv via: npm install dotenv
2. La till en port som alternativ till porten som är definierad enligt miljövariablerna: ``const port = process.env.PORT || 3300;``
3. Migrerade till docs.sqlite via ```sqlite3 docs.sqlite < migrate.sql```. La även till fejkdata i migrate.sql. Alt. ./db/reset_db.bash (färdig bash-script för att reseta)

### Val av frontend-ramverk

Vårt val av frontend-ramverk föll på React, med TypeScript. Efter lite efterforskningar uppfattar vi detta som attraktivt i arbetslivet för de tjänster som vi har kollat upp, vilket är den främsta anledningen till vårt val.

## Kmom02

### Instruktioner för att installera MongoDB på Ubuntu 22.04 LTS
```
sudo apt-get install dirmngr
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc |    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg    --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
mongosh // För att starta klienten i terminalen
```
**Note: man kan bli tvungen att ge behörighet genom följande kod**
```
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chmod 750 /var/lib/mongodb
```


### Tester
La till enkel testning.

mocha och chai är tillagda i package.json som dev dependencies. För att köra testerna, kör:
```
cd ssr-editor-0.1
nmp install // För att installera dev dependencies
npm test
```

Att göra:
- lägg till chai-http för att testa API:et
- elaborera lite kring testerna

### Instruktioner för att installera frontend, React med Typescript:
npx create-react-app frontend --template typescript
cd frontend/
npm run build