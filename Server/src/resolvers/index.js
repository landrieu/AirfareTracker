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
import userResolver from './user';
import trackerResolver from './tracker';
import ipResolver from './ip';
import airfareResolver from './airfare';
import scalars from './scalars';

const resolversArray = [
  userResolver,
  airfareResolver,
  trackerResolver,
  ipResolver,
  scalars
];

export const resolvers = mergeResolvers(resolversArray);