import { SAVE } from './types';

export const saveForm = ({email, from, to}) => {
    return {
            type: SAVE, email, from, to
    };
};

