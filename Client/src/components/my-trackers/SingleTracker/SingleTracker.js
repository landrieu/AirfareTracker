import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { DataService } from '../../../services/dataService';
import { useDispatch, useSelector } from 'react-redux';
import { NICE_NAMES, GRAPH_COLORS, TRACKER_STATUS } from '../../../services/appConstant';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { formatRangeDates } from '../../../helpers/date';

import { LineChart } from '../../charts/line-chart/LineChart';
import { LDSSpinner, LDSRing } from '../../misc/Loaders';
import { Toggle } from '../../misc/Toggle';

import './SingleTracker.scss';

export const SingleTracker = (props) => {

    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === props.tracker.id));
    const [isLoaded, setIsLoaded] = useState(false);
    const [statSelected, setStatSelected] = useState('Min prices');
    const [noData, setNoData] = useState(true);
    const [updatingTrackerStatus, setUpdatingTrackerStatus] = useState(false);
    const [updatingTrackerAlertStatus, setUpdatingTrackerAlertStatus] = useState(false);

    const [expand, setExpand] = useState(false);
    const [trackerDatasets, setTrackerDatasets] = useState([]);

    const dispatch = useDispatch();
    const statsAvailable = [
        { name: 'Min prices', field: 'minPrice' },
        { name: 'Max prices', field: 'maxPrice' },
        { name: 'Average prices', field: 'averagePrice' },
        { name: 'Median prices', field: 'medianPrice' }
    ];

    useEffect(() => {
        let airfares = tracker.airfares;

        setNoData(airfares && airfares.length === 0);

        if (!airfares) return;
        let tempColors = [...GRAPH_COLORS];
        let datasets = airfares.map((a) => {
            return {
                label: formatRangeDates(a.startDate, a.endDate),
                data: a.airfares.map((r) => ({ t: r.createdAt, y: r[statsAvailable.find((s) => s.name === statSelected).field] })),
                borderColor: function () {
                    let random = Math.floor(Math.random() * tempColors.length);
                    return tempColors.splice(random, 1)[0];
                }(),
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                fill: false
            }
        });

        setTrackerDatasets(datasets);
    }, [tracker, statSelected]);

    useEffect(() => {
        let mounted = true;
        //@TODO: Merge stats to get min, max, avg and mdn on time
        DataService.trackerById(props.tracker.id).then((tracker) => {
            if (mounted) {
                //Update single tracker when fetched
                setIsLoaded(true);
                dispatch(updateSingleTracker(tracker));
            }
        });

        return () => {
            console.log('UNMOUNTED')
            mounted = false;
        }
    }, []);

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

    function displayExpand() {
        if (!isLoaded) return <span><LDSSpinner width='25px' height='25px' /></span>

        return (
            <span className="sign" onClick={() => setExpand(!expand)}>{expand ? '-' : '+'}</span>
        )
    }

    function displayGraph() {
        if (noData) {
            return (
                <div className="no-data">
                    <span className="no-data-label">No data available</span>
                </div>
            )
        }

        return (
            <div className="my-tracker-graph">
                <div className="stats-available">
                    {statsAvailable.map((stat, index) =>
                        <span onClick={() => setStatSelected(stat.name)} className={`stat ${statSelected === stat.name ? 'selected' : ''}`} key={index}>{stat.name}</span>)
                    }
                </div>
                <LineChart datasets={trackerDatasets} maintainAspectRatio={false} chartID={`frequent-route-${props.index}`} />
            </div>
        )
    }

    return (
        <div key={props.index} className={`single-tracker ${isLoaded ? '' : 'disabled'}`}>
            <div className="single-tracker-top-container">
                <div className="single-tracker-top">
                    <span>{tracker.from ? tracker.from.city : ''} - {tracker.to ? tracker.to.city : ''}</span>
                    {displayExpand()}
                </div>
            </div>
            <div className={`single-tracker-body ${expand ? 'expand' : ''} ${noData ? 'no-data' : ''}`}>
                <div className="single-tracker-status">
                    <span className="single-tracker-label">Departure dates: </span>
                    <span>{tracker.startDates && moment(tracker.startDates[0]).format('dddd DD MMMM YYYY')} - {tracker.startDates && moment(tracker.startDates[tracker.startDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
                </div>
                <div className="single-tracker-status">
                    <span className="single-tracker-label">Return dates: </span>
                    <span>{tracker.endDates && moment(tracker.endDates[0]).format('dddd DD MMMM YYYY')} - {tracker.endDates && moment(tracker.endDates[tracker.endDates.length - 1]).format('dddd DD MMMM YYYY')}</span>
                </div>
                <div className="single-tracker-status">
                    <span className="single-tracker-label">Status: </span>
                    <Toggle isActive={tracker.isActive} isLoading={updatingTrackerStatus} loaderSize={'small'} onClick={toggleTrackerStatus} />
                </div>
                <div className="single-tracker-alert-status">
                    <span className="single-tracker-label">Alert:</span>
                    <Toggle isActive={tracker.isAlertActive} isLoading={updatingTrackerAlertStatus} loaderSize={'small'} onClick={toggleTrackerAlertStatus} />
                </div>
                {tracker.triggerPrice &&
                    <div>
                        Trigger price: {tracker.triggerPrice}
                    </div>
                }
                <div className="separator"></div>
                {displayGraph()}
            </div>
        </div>
    )
}

/**
 *
 */