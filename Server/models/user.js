const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//User schema
const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    registrationDate: Date,
    lastConnection: Date,
    trackers: Array
},{
    timestamps: true
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(userEmail){
    const query = {email: userEmail};
    return User.findOne(query);
}

module.exports.getAllUsers = function(){
    return User.find();
}

module.exports.getNumberUsers = function(){
    return User.countDocuments();
}

module.exports.insertUser = function(newUser, callback){
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt)=>{
            if(err){
                return reject({success: false, message: 'Could not generate salt'});
            }

            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then((newUser) => {
                    resolve({success: true, newUser});
                }).catch((err) => {
                    reject({success: false, message: err});
                });
            });
        });
    });   
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.updateUser = function(user, id,callback){
    User.update({"_id": id}, user, callback); 
}
