# ToDo
Objectum project example.

Requirements: [NodeJS (ES Modules)](https://nodejs.org), [PostgreSQL](https://www.postgresql.org/download/), [Redis](https://redis.io/)

Objectum ecosystem:
* Javascript platform https://github.com/objectum/objectum  
* Isomorhic javascript client https://github.com/objectum/objectum-client  
* Proxy for server methods and access control https://github.com/objectum/objectum-proxy  
* React components https://github.com/objectum/objectum-react  
* Command-line interface (CLI) https://github.com/objectum/objectum-cli  
* Objectum project example https://github.com/objectum/todo 

## Install

Install CLI:
```bash
npm i -g objectum-cli
```

Install platform
```bash
mkdir /opt/objectum
objectum-cli --create-platform --path /opt/objectum
```
objectum-cli defaults: 
```
--redis-host 127.0.0.1
--redis-port 6379
--objectum-port 8200
```

Install project:
```bash
mkdir /opt/objectum/projects/todo
cd /opt/objectum/projects/todo
git clone https://github.com/objectum/todo.git .
npm i -g yarn
yarn install
npm run build
cp -r /opt/objectum/projects/todo/sample/* /opt/objectum/projects/todo
```
/opt/objectum/projects/todo/config.json defaults: 
```
{
    "port": 3100 - project port 
    "database": {
        "host": "localhost", - host and port of PostgreSQL server
        "port": 5432,
        "dbPassword": "1", - password of database user "todo"
        "dbaPassword": "12345" - postgres password
    },
    "adminPassword": "sha1 hash" - password of project administrator. Default: "admin"
```

Create store:
```bash
cd /opt/objectum/projects/todo/bin
node create.js
node import.js
```

Run objectum:
```bash
cd /opt/objectum/server
node index-8200.js
```

Create models, properties, queries, records:
```bash
cd /opt/objectum/projects/todo
objectum-cli --import-json store.json
```

Build and run project:
```bash
cd /opt/objectum/projects/todo
npm run build
node index.js
```

Open URL http://127.0.0.1:3100

Admin (developer):  
login: admin  
password: admin

User (role "User"):  
login: user  
password: user

Run in development mode:
```bash
cd /opt/objectum/projects/todo
npm run start
```

Open URL http://127.0.0.1:3000

## Author

**Dmitriy Samortsev**

+ http://github.com/objectum


## Copyright and license

MIT
