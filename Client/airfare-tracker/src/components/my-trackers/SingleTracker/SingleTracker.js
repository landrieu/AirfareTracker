import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../../services/dataService';

import './SingleTracker.scss';

export const SingleTracker = (props) => {

    useEffect(() => {
        DataService.trackerById(props.tracker.id).then((data) => {
            //Update single tracker when fetched
            console.log(data);
        })
    }, []);
    
    return(
        <div className="single-tracker">
            <div className="single-tracker-top">
                <span>Paris - New York</span>
                <span>+</span>
            </div>
            <div className="single-tracker-body">
                <div>
                    Status: Active
                </div>
                <div>Info: feui</div>
                <div>Alert: 100$</div>
            </div>
        </div>
    )
}