import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { SingleTracker } from './SingleTracker/SingleTracker';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyTrackers } from '../../redux/MyTrackers/actions';

import { LDSSpinner, LDSRing } from '../misc/Loaders';

import './MyTrackers.scss';

export const MyTrackers = (props) => {
    //console.log('FUZVUY')
    const myTrackers = useSelector(state => state.myTrackers.trackers);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        //Fetch user trackers
        let mounted = true;
        setIsLoading(true);
        DataService.getUserTrackers().then(trackers => {
            //console.log(trackers);
            if(mounted){
                setIsLoading(false);
                dispatch(updateMyTrackers(trackers));
            }
        });

        return () => {
            mounted = false;
        }
    }, []);

    function loadingWheel(){
        if(!isLoading) return '';

        return (
            <div id="my-trackers-loader">
                <LDSRing />
            </div>
        )
    }
    
    return(
        <div id="my-trackers">
            {loadingWheel()}
            <div id="my-trackers-content">
            {myTrackers.map((tracker, index) => {
				return <SingleTracker key={index} index={index} tracker={tracker}/>
            })}
            </div>
        </div>
    )
}

/**
 * 
 */