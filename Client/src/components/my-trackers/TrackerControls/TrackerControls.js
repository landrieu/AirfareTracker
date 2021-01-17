import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { LABELS } from '../../../services/constants';
import { DataService } from '../../../services/dataService/';
import { useDispatch, useSelector } from 'react-redux';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { Toggle } from '../../misc/Toggle';
import { LDSSpinner } from '../../misc/Loaders';

import './TrackerControls.scss';

export const TrackerControls = ({ tracker }) => {
    const triggerPrice = useSelector(state => (state.myTrackers.trackers.find(t => t.id === tracker.id).triggerPrice));

    const [updatingTrackerStatus, setUpdatingTrackerStatus] = useState(false);
    const [updatingTrackerAlertStatus, setUpdatingTrackerAlertStatus] = useState(false);
    const [updatingTrackerTriggerPrice, setUpdatingTrackerTriggerPrice] = useState(false);
    const [oldTriggerPrice, setOldTrigerPrice] = useState('none');

    const [updateStatusError, setUpdateStatusError] = useState('');
    const [updateAlertStatusError, setUpdateAlertStatusError] = useState('');
    const [updateTriggerPriceError, setUpdateTriggerPriceError] = useState('');

    useEffect(() => {
        if(oldTriggerPrice === 'none' &&typeof triggerPrice == 'number') setOldTrigerPrice(triggerPrice)
    }, [triggerPrice]);

    const dispatch = useDispatch();

    function setTriggerPrice(triggerPrice) {
        dispatch(updateSingleTracker({ ...tracker, triggerPrice: Number(triggerPrice) }));
    }

    function setStatus(newStatus) {
        dispatch(updateSingleTracker({ ...tracker, isActive: newStatus }));
    }

    function setAlertStatus(newStatus) {
        dispatch(updateSingleTracker({ ...tracker, isAlertActive: newStatus }));
    }

    function clearErrorTimeout(fc) {
        setTimeout(() => {
            fc('');
        }, 1500);
    }

    function updateTriggerPrice(triggerPrice) {
        setUpdatingTrackerTriggerPrice(true);

        DataService.updateTracker(tracker.id, null, null, Number(triggerPrice)).then((res) => {
            if (!res.success) {
                setTriggerPrice(oldTriggerPrice);
                setUpdateTriggerPriceError(res.error);
                clearErrorTimeout(setUpdateTriggerPriceError);
            } else {
                //Update previous trigger price
                setOldTrigerPrice(Number(triggerPrice));
                setTriggerPrice(triggerPrice);
            }
        }).catch((e) => {
            //Fail, reset trigger price
            setTriggerPrice(oldTriggerPrice);
            setUpdateTriggerPriceError('Unexpected error');
            clearErrorTimeout(setUpdateTriggerPriceError);

        }).finally(() => {
            setUpdatingTrackerTriggerPrice(false);
        });
    }

    function toggleTrackerStatus() {
        let newStatus = !tracker.isActive;

        //Display the loading animation
        setUpdatingTrackerStatus(true);

        //Dispatch the change
        setStatus(newStatus);

        DataService.updateTracker(tracker.id, newStatus, null, null).then((res) => {
            if (!res.success) {
                setStatus(!newStatus);
                setUpdateStatusError(res.error);
                clearErrorTimeout(setUpdateStatusError);
            } else {
                setUpdateStatusError('');
            }
        }).catch(() => {
            setStatus(!newStatus);
            setUpdateStatusError('Unexpected error');
            clearErrorTimeout(setUpdateStatusError);
        }).finally(() => {
            setUpdatingTrackerStatus(false);
        });
    }

    function toggleTrackerAlertStatus() {
        let newStatus = !tracker.isAlertActive;

        //Display the loading animation
        setUpdatingTrackerAlertStatus(true);

        //Dispatch the change
        setAlertStatus(newStatus);

        //Update the status
        DataService.updateTracker(tracker.id, null, newStatus, null).then((res) => {
            if (!res.success) {
                //If fails, set the error
                //then clear it
                setAlertStatus(!newStatus);
                setUpdateAlertStatusError(res.error);
                clearErrorTimeout(setUpdateAlertStatusError);
            } else {
                setUpdateAlertStatusError('');
            }
        }).catch(() => {
            //Set the error
            setAlertStatus(!newStatus);
            setUpdateAlertStatusError('Unexpected error');
            clearErrorTimeout(setUpdateAlertStatusError);
        }).finally(() => {
            setUpdatingTrackerAlertStatus(false);
        });
    }
 
    return (
        <div className={`single-tracker-controls`}> 
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.TRACKER_ID} </span>
                <span className="single-tracker-info">{tracker.id}</span>
            </div>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.DEPARTURE_DATES} </span>
                <span className="single-tracker-info">{tracker.startDates && moment(tracker.startDates[0]).format('dddd DD MMMM YYYY')} - {tracker.startDates && moment(tracker.startDates[tracker.startDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
            </div>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.RETURN_DATES}</span>
                <span className="single-tracker-info">{tracker.endDates && moment(tracker.endDates[0]).format('dddd DD MMMM YYYY')} - {tracker.endDates && moment(tracker.endDates[tracker.endDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
            </div>
            <div className="single-tracker-status">
                <span className="single-tracker-label">{LABELS.STATUS}</span>
                <Toggle isActive={tracker.isActive} isLoading={updatingTrackerStatus} loaderSize={'small'} onClick={toggleTrackerStatus} />
                <span className='error-message'>{updateStatusError}</span>
            </div>
            <div className="single-tracker-alert-status">
                <span className="single-tracker-label">{LABELS.ALERT}</span>
                <Toggle isActive={tracker.isAlertActive} isLoading={updatingTrackerAlertStatus} loaderSize={'small'} onClick={toggleTrackerAlertStatus} />
                <span className='error-message'>{updateAlertStatusError}</span>
            </div>
            <div className="single-tracker-trigger-price">
                <span className="single-tracker-label">{LABELS.TRIGGER_PRICE}</span>
                <input type="number" disabled={updatingTrackerTriggerPrice} value={triggerPrice || ''} onChange={e => setTriggerPrice(e.currentTarget.value)} onBlur={e => updateTriggerPrice(e.currentTarget.value)}></input>
                {updatingTrackerTriggerPrice && <LDSSpinner width='20px' height='20px' size={'small'} />}
                <span className='error-message'>{updateTriggerPriceError}</span>
            </div>
        </div>
    )
}

