const fs = require('fs');
const path = require('path');
const {pg, Client} = require('pg');
const accountSeed  = require('./accountSeed.json');

(async () => {
  const client = new Client({
    user: 'habibakinwale',
    host: 'localhost',
    database: 'auncooperative',
    password: 'password',
    port: 5432,
  });
  await client.connect();

  const ignoreFields = ['isPorL', 'toIncrease', 'accountType', 'memo'];
  const text = 'INSERT INTO accounts("accountCode", "accountName", "toIncrease", "isPorL", "accountType", memo, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

  const accountJson = await new Promise((resolve, reject) => {
    return fs.readFile(path.join(__dirname, 'accountSeed.json'), (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(JSON.parse(data));
    });
  });
  
  Object.keys(accountJson).map(async (key) => {
    const accountCategory = accountJson[key];
    const isPorL = accountCategory['isPorL'];
    const toIncrease = accountCategory['toIncrease'];
    const accountType = key;
    const memo = accountCategory['memo'];
    
    Object.keys(accountCategory).map(async (categoryKey) => {
      if (!ignoreFields.includes(categoryKey)){
        const values = [categoryKey, accountCategory[categoryKey], toIncrease, isPorL, accountType, memo, new Date(), new Date()];

        try {
          const res = await client.query(text, values)
          console.log(res.rows[0])
        } catch (err) {
          console.log(err.stack)
        }
      };
    });
  });
  
})();