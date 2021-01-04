import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { SingleTracker } from './SingleTracker/SingleTracker';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyTrackers } from '../../redux/MyTrackers/actions';

import './MyTrackers.scss';

export const MyTrackers = (props) => {
    const myTrackers = useSelector(state => state.myTrackers.trackers);

    const dispatch = useDispatch();

    useEffect(() => {
        //Fetch user trackers
        DataService.getUserTrackers().then(trackers => {
            console.log(trackers);
            dispatch(updateMyTrackers(trackers));
        })
    }, []);
    
    return(
        <div id="my-trackers">
            <div id="my-trackers-content">
            {myTrackers.map((tracker, index) => {
				return <SingleTracker key={index} index={index} tracker={tracker}/>
            })}
            </div>
        </div>
    )
}