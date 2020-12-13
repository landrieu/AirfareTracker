import jwt from 'jsonwebtoken';
import {AUTH_SECRET} from '../config';
import {UserInputError, AuthenticationError, ValidationError} from 'apollo-server';

export const GenerateToken = ({id, email}) => {
    return jwt.sign({id, email}, AUTH_SECRET, { expiresIn: '1d' });
}

export const VerifyAuthentication = async auth => {
    if (!auth) throw new AuthenticationError('You must be logged in!');
  
    const token = auth.split('Bearer ')[1];
    if (!token) throw new AuthenticationError('You should provide a token!');
  
    const user = await jwt.verify(token, AUTH_SECRET, (err, decoded) => {
      if (err) throw new AuthenticationError('Invalid token!');
      return decoded;
    });

    return user;
};
  