import React, { useEffect, useState } from 'react';
import { Form } from './Form';

import './SetTracker.scss';

export const SetTracker = (props) => {

    useEffect(() => {
        //Check if the user can create a new tracker
        //If registered up to 5
        //Else 2
    }, []);

    return(
        <div id="set-tracker">
            <Form />
        </div>
    )
}
