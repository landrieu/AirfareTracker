const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8000;
const database = require('./database');

//Routes
const users = require('./routes/users');
const trackers = require('./routes/trackers');
const ips = require('./routes/ips');

router.use(cors());
app.enable('trust proxy');

//Body parser middleware
router.use(bodyParser.json());

//Give access to the public repository
router.use(express.static('public'));

router.use('/users', users);
router.use('/trackers', trackers);
router.use('/ips', ips);

//Define a middleware
const h = (req, res, next) => {
  console.log('Handler');
  next();
};

router.get('/', (req, res) => {
  res.send('Hello World!')
});

router.get('/test', [h, (req, res) => {
  console.log(req.ip);
  const json = {
    name: 'Bob',
    age: 28
  };

  res.json(json);
}]);

app.use('/api/', router);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
}); 


//app.use('/airfares-tracker/api/', router);