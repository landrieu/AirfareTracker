import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../services/dataService/';
import { SingleTracker } from './SingleTracker/SingleTracker';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyTrackers } from '../../redux/MyTrackers/actions';

import { gql } from "@apollo/client";

import { LDSRing } from '../misc/Loaders';

import './MyTrackers.scss';

export const MyTrackers = () => {
    const myTrackers = useSelector(state => state.myTrackers.trackers);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const GET_TRACKERS = gql`
    query ($userId: String){
      trackersByUser(userId: $userId) {
        id
        sources
        to{
          iataCode
          city
        }
        from{
          iataCode
          city
        }  
      }
    }
    `;

    /*const { loading, error, trackers } = useQuery(GET_TRACKERS, {
        fetchPolicy: "no-cache"
    });*/


    useEffect(() => {
        //Fetch user trackers
        let mounted = true;
        setIsLoading(true);
        DataService.getUserTrackers().then(trackers => {
            if (mounted) {
                setIsLoading(false);
                setError('');
                dispatch(updateMyTrackers(trackers));
            }
        }).catch((e) => {
            console.log(e.message);
            if(mounted){
                setIsLoading(false);
                setError('Could not fetch your trackers');
            }
        });

        return () => {
            mounted = false;
        }
    }, []);

    function loadingWheel() {
        if (!isLoading) return '';

        return (
            <div id="my-trackers-loader">
                <LDSRing />
            </div>
        )
    }

    function displayMyTrackers() {
        if (error) {
            return (
                <div id="my-trackers-error">
                    {error}
                </div>
            );
        } else {
            return (
                <div id="my-trackers-content">
                    {myTrackers.map((tracker, index) => {
                        return <SingleTracker key={index} index={index} tracker={tracker} />
                    })}
                </div>
            );
        }
    }

    return (
        <div id="my-trackers">
            {loadingWheel()}
            {displayMyTrackers()}
        </div>
    )
}

/**
 *
 */