const userTypeDef = require('./user');
const ipTypeDef = require('./ip')

const typeDefs = []

export const typeDefs = gql`
  type Job {
    id: ID
    name: String
    contact: Contact
    start: String
    end: String
  }
  
  type Activity {
    id: ID
    name: String
    start: String
    end: String
  }

  type Contact {
    id: ID
    name: String
  }

  type Resource {
    id: ID
    name: String
  }

  type JobAllocation {
    id: ID
    resource: Resource
    job: Job
  }

  type ActivityAllocation {
    id: ID
    resource: Resource
    activity: Activity
  }

  type Query {
    jobs(name: String): [Job],
    contacts: [Contact],
    activities: [Activity],
    resources: [Resource],
    jobAllocations: [JobAllocation],
    activityAllocations: [ActivityAllocation]   
  }
`