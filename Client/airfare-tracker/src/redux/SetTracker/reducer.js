import { updateForm } from './actions';
import { SAVE, CLEAR, UPDATE } from './types';

const INITIAL_STATE = {
    email: '',
    from: '',
    to: '',
    departureDates: null,
    returnDates: null
};

const reducer = (state = INITIAL_STATE, action) => {
    console.log(action)
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
            console.log(updatedForm)
            return {...state, ...updatedForm}

        case CLEAR: return {};

        default: return state;
    }
};
export default reducer;