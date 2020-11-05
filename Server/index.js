const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const port = 8000;
const database = require('./database');

//Routes
const users = require('./routes/users');
const trackers = require('./routes/trackers');
const ips = require('./routes/ips');

//Body parser middleware
app.use(bodyParser.json());

//Give access to the public repository
app.use(express.static('public'));

app.use('/users', users);
app.use('/trackers', trackers);
app.use('/ips', ips);

//Define a middleware
const h = (req, res, next) => {
  console.log('Handler');
  next();
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/test', [h, (req, res) => {
  console.log(req.ip);
  const json = {
    name: 'Bob',
    age: 28
  };

  res.json(json);
}]);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});