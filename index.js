const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001

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

  console.log("username", username);
  console.log("password", password);

  if(username && password) {
    res.send("ok");
  }
  else {
    res.send("not ok");
  }
  
})

app.post('/admin/create', (req, res) => {

  const name = req.body.name;
  const desc = req.body.desc;
  const picture = req.body.picture;

  res.send("ok");
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})