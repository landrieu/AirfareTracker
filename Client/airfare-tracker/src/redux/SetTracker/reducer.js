import { SAVE } from './types';

const INITIAL_STATE = {
    email: '',
    from: '',
    to: ''
};

const reducer = (state = INITIAL_STATE, action) => {
    console.log(action)
    switch (action.type) {
        case SAVE:
            return {
                ...state, email: action.email, from: action.from, to: action.to
            };



        default: return state;
    }
};
export default reducer;