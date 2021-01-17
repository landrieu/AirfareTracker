import React, { useEffect, useState } from 'react';
import { ObjectID } from 'mongodb';

import { LDSRing } from '../misc/Loaders';
import { SingleTracker } from '../my-trackers/SingleTracker/SingleTracker';
import { DataService } from '../../services/dataService/';
import { clearMyTrackers, updateSingleTracker, updateMyTrackers } from '../../redux/MyTrackers/actions';

import { useDispatch, useSelector } from 'react-redux';

import './FindTracker.scss';
import { SetTracker } from '../set-tracker/SetTracker';

export const FindTracker = ({ match }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [trackerId, setTrackerId] = useState(match.params.id || '');
    const [trackerError, setTrackerError] = useState('');
    //const [tracker, setTracker] = useState();
    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === trackerId));

    function fetchTracker() {
        console.log(trackerId);
        setLoading(true);

        DataService.trackerById(trackerId).then((tracker) => {
            dispatch(updateMyTrackers([tracker]));
        }).catch((e) => {
            console.log(e.message);
            setTrackerError('An error occured');
        }).finally(() => {
            setLoading(false);
        });
    }

    function validateID() {
        return ObjectID.isValid(trackerId);
    }

    function onSubmit(e) {
        e.preventDefault();

        if (!trackerId) return setTrackerError('Enter a tracker ID')
        if (!validateID()) return setTrackerError('The tracker ID is not valid');

        //Fetch 
        fetchTracker();
    }

    useEffect(() => {
        let mounted = true;

        if (trackerId) fetchTracker();

        return () => {
            mounted = false;
            dispatch(clearMyTrackers());
        }
    }, []);

    function render() {
        if (loading) {
            return (<div id="find-tracker-loader">
                <LDSRing />
            </div>)
        } else if (tracker) {
            return <SingleTracker index={0} tracker={tracker} expandInit={true} />
        } else {
            return (
                <form id="find-tracker-form" onSubmit={(e) => onSubmit(e)}>
                    <div id="find-tracker-id">
                        <input type="text" placeholder="Tracker ID" onChange={(e) => setTrackerId(e.currentTarget.value)} value={trackerId} />
                        <div className="error-message">{trackerError}</div>
                    </div>
                    <div id="find-tracker-button">
                        <button className={`${loading ? 'loading' : ''}`} type="submit">
                            Submit
                        </button>
                    </div>
                </form>

            );
        }
    }

    return (
        <div id="find-tracker">
            <div id="find-tracker-content">
                {render()}
            </div>
        </div>
    )
}