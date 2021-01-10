import jwt from 'jsonwebtoken';
import { AUTH_SECRET } from '../config';
import { UserInputError, AuthenticationError, ValidationError } from 'apollo-server';
import { AuthenticationError as AUError } from '../../classes/RequestOperation';

export const GenerateToken = ({ id, email, role = 'USER' }) => {
  //Store id, email and role
  return jwt.sign({ id, email, role }, AUTH_SECRET, { expiresIn: '1d' });
}

export const VerifyAuthentication = async auth => {
  //if (!auth) throw new AUError('AUTH', 'Tou must be logged in!');
  if (!auth) throw new AuthenticationError('You must be logged in!');

  const token = auth.split('Bearer ')[1];
  if (!token) throw new AuthenticationError('You should provide a token!');

  const user = await jwt.verify(token, AUTH_SECRET, (err, decoded) => {
    if (err) throw new AuthenticationError('Invalid token!');
    return decoded;
  });

  return user;
};
