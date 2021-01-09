import React, { useCallback, useEffect, useState } from 'react';
import { DataService } from '../../../services/dataService';
import { useDispatch, useSelector } from 'react-redux';
import { NICE_NAMES, GRAPH_COLORS, TRACKER_STATUS } from '../../../services/appConstant';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { formatRangeDates } from '../../../helpers/date';

import { LineChart } from '../../charts/line-chart/LineChart';
import { LDSSpinner, LDSRing } from '../../misc/Loaders';

import './SingleTracker.scss';

export const SingleTracker = (props) => {
    
    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === props.tracker.id));
    //console.log(tracker.id, props.tracker.id);
    const [isLoaded, setIsLoaded] = useState(false);
    const [statSelected, setStatSelected] = useState('Min price');
    const [noData, setNoData] = useState(true);

    const [expand, setExpand] = useState(false);
    const [trackerDatasets, setTrackerDatasets] = useState([]);

    const dispatch = useDispatch();
    const statsAvailable = [
        { name: 'Min prices', field: 'minPrice' },
        { name: 'Max prices', field: 'maxPrice' },
        { name: 'Average prices', field: 'averagePrice' },
        { name: 'Median prices', field: 'medianPrice' }
    ];

    function formatAirfares(airfares){  
        setNoData(airfares && airfares.length === 0);
        if(!airfares) return;
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
                fill: false
            }
        });

        setTrackerDatasets(datasets);
    }

    function reformatDataset(statName){
        let airfares = tracker.airfares;
        //console.log(tracker)
        let tempColors = [...GRAPH_COLORS];      
        let datasets = airfares.map((a) => {
            return {
                label: formatRangeDates(a.startDate, a.endDate),
                data: a.airfares.map((r) => ({t: r.createdAt, y: r[statsAvailable.find((s) => s.name === statName).field]})),
                borderColor: function(){
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

        console.log(datasets)
        setTrackerDatasets(datasets);
    }

    useEffect(() => {
        let mounted = true;
        DataService.trackerById(props.tracker.id).then((tracker) => {
            if(mounted){
                //Update single tracker when fetched
                setIsLoaded(true);
                dispatch(updateSingleTracker(tracker));
                formatAirfares(tracker.airfares);
            }
        });

        return () => {
            console.log('UNMOUNTED')
            mounted = false;
        }
    }, []);

    function displayExpand(){
        if(!isLoaded) return <span><LDSSpinner width='25px' height='25px'/></span>

        return (
            <span className="sign" onClick={() => setExpand(!expand)}>{expand ? '-' : '+'}</span>
        )
    }

    function selectStat(statName){
        setStatSelected(statName);
        reformatDataset(statName);
    }

    function displayGraph(){
        if(noData){
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
                    <span onClick={() => selectStat(stat.name)}  className={`stat ${statSelected === stat.name ? 'selected': ''}`} key={index}>{stat.name}</span>)
                    }
                </div>
                <LineChart datasets={trackerDatasets} maintainAspectRatio={false} chartID={`frequent-route-${props.index}`}/>
            </div>
        )
    }
    
    return(
        <div key={props.index} className={`single-tracker ${isLoaded ? '' : 'disabled'}`}>
            <div className="single-tracker-top">
                <span>{tracker.from ? tracker.from.city: ''} - {tracker.to ? tracker.to.city: ''}</span>
                {displayExpand()}
            </div>
            <div className={`single-tracker-body ${expand ? 'expand': ''} ${noData ? 'no-data' : ''}`}>
                <div>
                    Status: {tracker.isActive ? 'Active': 'Not active'}
                </div>
                <div>
                    Alert enabled: {tracker.isAlertEnabled ? 'Yes' : 'No'}
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