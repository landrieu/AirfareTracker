const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.uri, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on('connected',()=>{
    console.log("Connected to DB");
});

mongoose.connection.on('error',(err)=>{
    console.log("Error" + err);
});