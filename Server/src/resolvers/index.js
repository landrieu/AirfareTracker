/*import { userQueryResolver, userMutationResolver} from './user';
import { trackerQueryResolver, trackerMutationResolver} from './tracker';
//import { Tracker } from '../models/Tracker';

import { scalars } from './scalars';

export const resolvers = {
    Query: {
        ...userQueryResolver,
        ...trackerQueryResolver
        
    },
    Mutation: {
        ...userMutationResolver
    },
    //Define new types such as Date
    ...scalars
}*/

const { mergeResolvers } = require('@graphql-tools/merge');
import userResolver from './user-resolver';
import trackerResolver from './tracker-resolver';
import ipResolver from './ip-resolver';
import airfareResolver from './airfare-resolver';
import airportResolver from './airport-resolver';
import scalars from './scalars-resolver';

const resolversArray = [
  userResolver,
  airfareResolver,
  airportResolver,
  trackerResolver, 
  ipResolver,
  scalars
];

export const resolvers = mergeResolvers(resolversArray);