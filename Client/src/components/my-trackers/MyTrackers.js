import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService/';
import { SingleTracker } from './SingleTracker/SingleTracker';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyTrackers, clearMyTrackers } from '../../redux/MyTrackers/actions';

import { LDSRing } from '../misc/Loaders';

import './MyTrackers.scss';

export const MyTrackers = () => {
    const myTrackers = useSelector(state => state.myTrackers.trackers);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        //Fetch user trackers
        let mounted = true;
        setIsLoading(true);
        DataService.getUserTrackers().then(trackers => {
            if (mounted) {
                setError('');
                dispatch(updateMyTrackers(trackers));
            }
        }).catch((e) => {
            console.log(e.message);
            if (mounted) setError('Could not fetch your trackers');
        }).finally(() => {
            if (mounted) setIsLoading(false);
        })

        return () => {
            mounted = false;
            dispatch(clearMyTrackers());
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

    function render() {
        if (isLoading) {
            return (
                <div id="my-trackers-loader">
                    <LDSRing />
                </div>
            )
        } else if (error) {
            return (
                <div id="my-trackers-error">
                    {error}
                </div>
            );
        } else {
            return (
                <div id="my-trackers-content">
                    <div id="my-trackers-numbers">
                        <div>
                            <span>Trackers number:</span>
                            <span>{myTrackers.length}</span>
                        </div>
                        <div>
                        <span>Active trackers:</span>
                        <span>{myTrackers.filter((t) => t.isActive).length}</span>
                        </div>
                    </div>
                    <div>
                        {myTrackers.map((tracker, index) => {
                            return <SingleTracker key={index} index={index} tracker={tracker} />
                        })}
                    </div>
                </div>

            );
        }
    }

    return (
        <div id="my-trackers">
            {render()}
        </div>
    )
}