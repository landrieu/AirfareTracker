import React, { useEffect, useState } from 'react';

import { Autocomplete } from '../others/Autocomplete';

import './SetTracker.scss';

export const SetTracker = (props) => {
    const [canCreateTracker, setCanCreateTracker] = useState(false);

    const airports = [{city: 'Toulouse'}, {city: 'Paris'}, {city: 'Tours'}, {city: 'Toulon'}];


    useEffect(() => {
        //Check if the user can create a new tracker
        //If registered up to 5
        //Else 2
        setTimeout(() => {
            setCanCreateTracker(true);
        }, 5000);

        //setTimeout(() => {
        //let airports = 
            //}, 1000)
        
    }, []);

    return(
        <div id="set-tracker">
            <div id="set-tracker-form" className={canCreateTracker ? '' : 'disabled'}>
                <div id="set-tracker-title">Create a tracker</div>
                <div id="set-tracker-fields">
                    <div className="inline-fields">
                        <Autocomplete ID='from' placeholder='From' suggestions={airports} />
                        <Autocomplete ID='to' placeholder='To' suggestions={airports} />
                    </div>

                    <div className="inline-fields">
                        <div>
                            <input type="text" id="departure-date-from" placeholder="Departure date from"/>
                        </div>
                        <div>
                            <input type="text" id="departure-date-to" placeholder="Departure date to"/>
                        </div>
                    </div>
                    <div id="email-price" className="inline-fields">
                        <div>
                            <input type="text" placeholder="Email"/>
                        </div>
                        <div>
                            <input type="number" placeholder="Price limit"/>
                        </div>
                    </div>
                </div>
                <div id="set-tracker-button">
                    <button><div>Submit</div></button>
                </div>
            </div>
        </div>
    )
}
