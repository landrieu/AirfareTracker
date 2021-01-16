import React, { useState } from 'react';
import moment from 'moment';

import { LABELS } from '../../../services/constants';
import { DataService } from '../../../services/dataService/';
import { useDispatch } from 'react-redux';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { Toggle } from '../../misc/Toggle';
import { LDSSpinner } from '../../misc/Loaders';

import './TrackerControls.scss';

export const TrackerControls = ({ tracker }) => {
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
            dispatch(updateSingleTracker({ ...tracker, triggerPrice }));

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
            console.log(e.message);
            
            dispatch(updateSingleTracker({ ...tracker, isActive: !newStatus }));
        }).finally(() => {
            setUpdatingTrackerStatus(false);
        });
    }

    function toggleTrackerAlertStatus() {
        let newStatus = !tracker.isAlertActive;

        //Display the loading animation
        setUpdatingTrackerAlertStatus(true);

        //Dispatch the change
        dispatch(updateSingleTracker({ ...tracker, isAlertActive: newStatus }));

        //Update the status
        DataService.updateTrackerAlertStatus(tracker.id, newStatus).then((res) => {
            console.log(res);
        }).catch((e) => {
            console.log(e.message);
            dispatch(updateSingleTracker({ ...tracker, isAlertActive: !newStatus }));
        }).finally(() => {
            setUpdatingTrackerAlertStatus(false);
        });
    }

    return (
        <div className={`single-tracker-controls`}>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.DEPARTURE_DATES} </span>
                <span>{tracker.startDates && moment(tracker.startDates[0]).format('dddd DD MMMM YYYY')} - {tracker.startDates && moment(tracker.startDates[tracker.startDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
            </div>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.RETURN_DATES}</span>
                <span>{tracker.endDates && moment(tracker.endDates[0]).format('dddd DD MMMM YYYY')} - {tracker.endDates && moment(tracker.endDates[tracker.endDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
            </div>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.STATUS}</span>
                <Toggle isActive={tracker.isActive} isLoading={updatingTrackerStatus} loaderSize={'small'} onClick={toggleTrackerStatus} />
            </div>
            <div className="single-tracker-alert-status">
                <span className="single-tracker-label">{LABELS.ALERT}</span>
                <Toggle isActive={tracker.isAlertActive} isLoading={updatingTrackerAlertStatus} loaderSize={'small'} onClick={toggleTrackerAlertStatus} />
            </div>
            <div className="single-tracker-trigger-price">
                <span className="single-tracker-label">{LABELS.TRIGGER_PRICE}</span>
                <input type="number" disabled={updatingTrackerTriggerPrice} value={triggerPrice || ''} onChange={e => setTriggerPrice(e.currentTarget.value)} onBlur={e => updateTriggerPrice(e.currentTarget.value)}></input>
                {updatingTrackerTriggerPrice && <LDSSpinner width='20px' height='20px' size={'small'} />}
            </div>
        </div>
    )
}

