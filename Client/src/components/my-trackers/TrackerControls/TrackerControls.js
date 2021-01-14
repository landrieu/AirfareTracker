import React, { useEffect, useState } from 'react';

import { DataService } from '../../../services/dataService';
import { useDispatch } from 'react-redux';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { Toggle } from '../../misc/Toggle';
import { LDSSpinner } from '../../misc/Loaders';

import './TrackerControls.scss';

export const TrackerControls = ({tracker}) => {
    const [updatingTrackerStatus, setUpdatingTrackerStatus] = useState(false);
    const [updatingTrackerAlertStatus, setUpdatingTrackerAlertStatus] = useState(false);
    const [updatingTrackerTriggerPrice, setUpdatingTrackerTriggerPrice] = useState(false);
    const [oldTriggerPrice, setOldTrigerPrice] = useState();
    const [triggerPrice, setTriggerPrice] = useState(tracker.triggerPrice);

    const dispatch = useDispatch();

    function updateTriggerPrice(triggerPrice) {
        setUpdatingTrackerTriggerPrice(true);
        DataService.updateTracker(tracker.id, null, null, Number(triggerPrice)).then((res) => {
            //Update previous trigger price
            setOldTrigerPrice(triggerPrice);
            dispatch(updateSingleTracker({ ...tracker, triggerPrice}));

        }).catch((e) => {
            //Fail, reset trigger price
            setTriggerPrice(oldTriggerPrice);
            
        }).finally(() => {
            setUpdatingTrackerTriggerPrice(false);
        });
    }

    function toggleTrackerStatus() {
        let newStatus = !tracker.isActive;
        setUpdatingTrackerStatus(true);
        dispatch(updateSingleTracker({ ...tracker, isActive: newStatus }));

        DataService.updateTrackerStatus(tracker.id, newStatus).then((res) => {
            console.log(res);
        }).catch((e) => {
            console.log(e);
            dispatch(updateSingleTracker({ ...tracker, isActive: !newStatus }));
        }).finally(() => {
            setUpdatingTrackerStatus(false);
        });
    }

    function toggleTrackerAlertStatus() {
        let newStatus = !tracker.isAlertActive;
        setUpdatingTrackerAlertStatus(true);
        dispatch(updateSingleTracker({ ...tracker, isAlertActive: newStatus }));

        DataService.updateTrackerAlertStatus(tracker.id, newStatus).then((res) => {
            console.log(res);
        }).catch((e) => {
            console.log(e);
            dispatch(updateSingleTracker({ ...tracker, isAlertActive: !newStatus }));
        }).finally(() => {
            setUpdatingTrackerAlertStatus(false);
        });
    }

    return (
        <div className={`single-tracker-controls`}>
            <div className="single-tracker-status">
                <span className="single-tracker-label">Status: </span>
                <Toggle isActive={tracker.isActive} isLoading={updatingTrackerStatus} loaderSize={'small'} onClick={toggleTrackerStatus} />
            </div>
            <div className="single-tracker-alert-status">
                <span className="single-tracker-label">Alert:</span>
                <Toggle isActive={tracker.isAlertActive} isLoading={updatingTrackerAlertStatus} loaderSize={'small'} onClick={toggleTrackerAlertStatus} />
            </div>
            <div className="single-tracker-trigger-price">
                <span className="single-tracker-label">Trigger price:</span>
                <input type="number" disabled={updatingTrackerTriggerPrice} value={triggerPrice || ''} onChange={e => setTriggerPrice(e.currentTarget.value)} onBlur={e => updateTriggerPrice(e.currentTarget.value)}></input>
                {updatingTrackerTriggerPrice && <LDSSpinner width='20px' height='20px' size={'small'} />}
            </div>
        </div>
    )
}

