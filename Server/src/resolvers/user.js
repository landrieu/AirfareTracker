import bcrypt from 'bcryptjs';

import { User } from '../models/User';
import { Tracker } from '../models/Tracker';
import {GenerateToken} from '../services/authentication';

import {UserInputError, AuthenticationError, ValidationError} from 'apollo-server';

const roles = {
    admin: "ADMIN",
    user: "USER"
};

module.exports = {
    Query: {
        users: () => {
            return User.find();
        },
        userByEmail: (_, {email}) => {
            return User.findOne({email});
        }
    },
    Mutation: {
        createUser: async (_, {email, password}) => {
            const { errors, valid } = {errors: null, valid: true};//validateRegister(email, password);
            if (!valid) throw new UserInputError('Error', { errors });

            const existingUser = await User.findOne({email});
            if (existingUser) throw new ValidationError('This email is not valid!');

            password = await bcrypt.hash(password, 10); // hashing the password
            const newUser = new User({
                email, 
                password,
                role: roles.user,
                trackers: [],
                registrationDate: new Date().toISOString(),
                lastConnectionAt: null
            });

            const res = await newUser.save();
            const token = GenerateToken(res);
      
            return {
              id: res._id,
              ...res._doc,
              token
            };
        },
        loginUser: async (_, {email, password}) => {
            // validateLogin is a simple func that checks for empty fields
            // and return valid = false if any.
            const { errors, valid } = {errors: null, valid: true};//validateLogin(username, password);
            if(!valid) throw new UserInputError('Errors', {errors});

            // check if that user already exists.
            const user = await User.findOne({email});
            if (!user) throw new AuthenticationError('User not found!');

            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new AuthenticationError('Wrong password!');

            const token = GenerateToken(user); // generate a token if no erros.
            return {
                id: user._id, // set an id
                user: user._doc, // spread the user info (email, created at, etc)
                token: `Bearer ${token}`
            };
        },
        updateLastConnection: async (_, {userId}) => {
            try {
                await User.findOneAndUpdate(
                    {_id: userId}, 
                    {$set: {lastConnectionAt: new Date()}}, 
                    {useFindAndModify: false}
                );
                return {success: true};
            } catch (error) {
                return {success: false, error};
            }            
        },
        deleteUser: async (_, {userId}) => {
            try{
                //Delete the user
                const user = await User.findOneAndDelete({_id: userId}, {useFindAndModify: false});

                if(user){
                    //Disable all the trackers associated to the user
                    await Tracker.updateMany({userId}, {$set: {isActive: false}}, {useFindAndModify: false});
                }
                return {success: true};
            }catch(error){
                return {success: false, error};
            }
        }
    },
    User: {
        /**
         * Return trackers associated to a user
         * @param {Object} user 
         */
        trackers(user) {
            return Tracker.find({"_id": {"$in": user.trackers}});
        }
    }
}