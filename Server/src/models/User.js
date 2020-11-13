import mongoose from 'mongoose';

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
    role: String,
    registrationDate: Date,
    lastConnectionAt: Date,
    trackers: Array
},{
    timestamps: true
});

export const User = mongoose.model('User', userSchema);