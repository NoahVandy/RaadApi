const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = 3001;

const connection = mysql.createConnection({
  host: 'cst-323.cknx30qxg2cd.us-east-2.rds.amazonaws.com',
  port: '3306',
  user: 'NoahStudent',
  password: 'bscp-gcu-noah',
  database: '326'
})

connection.connect();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/admin/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    const sql = `SELECT * FROM ADMIN_USERS where username = '${username}' AND password = '${password}';`;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if(result.length) {
        console.log(result);
        res.sendStatus(200);
      }
      else {
        console.log("no user found");
        res.send('no user found');
      }
    });
  }
  else {
    res.sendStatus(500);
  }
  
})

app.post('/admin/create', (req, res) => {
  
  const name = req.body.name;
  const desc = req.body.desc;
  const picture = req.body.picture;

  if(name && desc && picture) {
    const sql = `INSERT INTO STORE_ITEMS VALUES (null, '${name}', '${desc}', '${picture}')`;

    connection.query(sql, (err, result) => {
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      if(result) {
        console.log(result);
        res.sendStatus(200);
      }
    })
  }
  else {
    res.send("no username or password received");
  }
})

app.get('/admin/getItems', (req, res) => {

  const sql = 'SELECT * FROM STORE_ITEMS';

  connection.query(sql, (err, result) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      console.log(result);
      res.send(result);
    }
  })
})

app.post('/admin/deleteItem', (req, res) => {
  
  const itemId = req.body.itemId;

  const sql = `DELETE FROM STORE_ITEMS WHERE id = ${itemId}`;

  connection.beginTransaction(sql, (err, result) => {
    if(err) {
      connection.rollback(() => {
        console.log(err)
      });
    }
    console.log(result);
    connection.commit((err) => {
      if(err) {
        connection.rollback((err) => {
          console.log(err);
        })
      }
      console.log(result);
      if(result.affectedRows === 1) {
        res.sendStatus(200);
      }
      else {
        res.send("no rows deleted");
      }
      
    })
  })

})

app.post('/admin/updateItem', (req, res) => {

  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.desc;
  const picUrl = req.body.picUrl;

  const sql = `UPDATE STORE_ITEMS SET \`name\` = '${name}', \`desc\` = '${desc}', \`picUrl\` = '${picUrl}' WHERE id = ${id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(result);
    if(result.affectedRows === 1) {
      res.sendStatus(200);
    }
    else {
      res.send("no item found with that id");
    }
    
  });

})

app.get('/admin/getItem/:id', (req, res) => {

  const id = req.params.id;
  console.log(id);

  const sql = `SELECT * FROM STORE_ITEMS WHERE id = ${id}`;

  connection.query(sql, (err, result) => {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    if(result.length) {
      console.log(result);
      res.send(result);
    }
    else if(result.length === 0) {
      res.send("no item found");
    }
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})