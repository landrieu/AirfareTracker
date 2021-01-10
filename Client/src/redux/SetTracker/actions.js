import { SAVE, CLEAR_FORM, UPDATE } from './types';

export const updateForm = (form) => {
    return {
        type: UPDATE, ...form
    }
};

export const saveForm = ({email, from, to}) => {
    return {
            type: SAVE, email, from, to
    };
};

export const clearForm = () => {
    return {
        type: CLEAR_FORM
    };
};

