import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../../services/dataService';
import { useDispatch, useSelector } from 'react-redux';
import { NICE_NAMES, GRAPH_COLORS, TRACKER_STATUS } from '../../../services/appConstant';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { formatRangeDates } from '../../../helpers/date';

import {LineChart} from '../../charts/line-chart/LineChart';


import './SingleTracker.scss';

export const SingleTracker = (props) => {
    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === props.tracker.id));

    const [expand, setExpand] = useState(false);
    const [trackerDatasets, setTrackerDatasets] = useState([]);

    const dispatch = useDispatch();
    const statsAvailable = ['Min price', 'Max price', 'Average price', 'Median price']

    function formatAirfares(airfares){  
        let tempColors = [...GRAPH_COLORS];          
        let datasets = airfares.map((a) => {
            return {
                label: formatRangeDates(a.startDate, a.endDate),
                data: a.airfares.map((r) => ({t: r.createdAt, y: r.minPrice})),
                borderColor: function(){
                    let random = Math.floor(Math.random() * tempColors.length);
                    return tempColors.splice(random, 1)[0];
                }(),
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                //backgroundColor: 'red',
                fill: false
            }
        });

        setTrackerDatasets(datasets);
    }

    useEffect(() => {
        DataService.trackerById(props.tracker.id).then((tracker) => {
            formatAirfares(tracker.airfares);
            //Update single tracker when fetched
            dispatch(updateSingleTracker(tracker));
            console.log(tracker);
        })
    }, []);
    
    return(
        <div className="single-tracker">
            <div className="single-tracker-top">
                <span>{tracker.from ? tracker.from.city: ''} - {tracker.to ? tracker.to.city: ''}</span>
                <span className="sign" onClick={() => setExpand(!expand)}>{expand ? '-' : '+'}</span>
            </div>
            <div className={`single-tracker-body ${expand ? 'expand': ''}`}>
                <div>
                    Status: {tracker.isActive ? 'Active': 'Not active'}
                </div>
                <div>Info: feui</div>
                <div>Alert: 100$</div>
                <div className="stats-available">
                    {statsAvailable.map(stat => 
                    <div>{stat}</div>)
                    }
                </div>
                <LineChart datasets={trackerDatasets} chartID={`frequent-route-${props.index}`}/>
            </div>
        </div>
    )
}