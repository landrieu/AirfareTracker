import { SAVE, CLEAR_FORM, UPDATE } from './types';

/*const INITIAL_STATE = {
    email: 'lio23@hotmail.fr',
    from: {
      id: '5fc75e5fa8622245c8729229',
      city: 'Paris',
      name: 'Paris',
      iataCode: 'PAR',
      region: 'FR-J',
      country: 'FR',
      isSingleAirport: false,
      __typename: 'Airport',
      text: 'Paris, FR (PAR) - All airports'
    },
    to: {
      id: '5fae06e79c4d7728f42b1b49',
      city: 'Lyon',
      name: 'Lyon Saint-Exupéry Airport',
      iataCode: 'LYS',
      region: 'FR-V',
      country: 'FR',
      isSingleAirport: true,
      __typename: 'Airport',
      text: 'Lyon Saint-Exupéry Airport - Lyon (LYS)'
    },
    departureDates: [
      null,
      null
    ],
    returnDates: [
      null,
      null
    ],
    triggerPrice: null,
    alertEnabled: false
};*/

const INITIAL_STATE = {
  email: '',
  from: '',
  to: '',
  departureDates: [],
  returnDates: [],
  triggerPrice: '',
  alertEnabled: undefined
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE:
            return {
                ...state, 
                email: action.email, 
                from: action.from, 
                to: action.to
            };
        
        case UPDATE: 
            let updatedForm = {};
            for(let k in action){
               if(state[k] !== undefined) updatedForm[k] = action[k]
            }
            return {...state, ...updatedForm}

        case CLEAR_FORM: return INITIAL_STATE;

        default: return state;
    }
};
export default reducer;