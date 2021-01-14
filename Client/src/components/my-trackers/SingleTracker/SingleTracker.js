import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { DataService } from '../../../services/dataService';
import { useDispatch, useSelector } from 'react-redux';
import { GRAPH_COLORS } from '../../../services/appConstant';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { formatRangeDates, breakDownDate } from '../../../helpers/date';

import { TrackerControls } from '../TrackerControls/TrackerControls';
import { LineChart } from '../../charts/line-chart/LineChart';
import { LDSSpinner } from '../../misc/Loaders';

import './SingleTracker.scss';

export const SingleTracker = (props) => {

    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === props.tracker.id));
    const [isLoaded, setIsLoaded] = useState(false);
    const [statSelected, setStatSelected] = useState('Min prices');
    const [noData, setNoData] = useState(true);
    const [graphColors, setGraphColors] = useState([]);

    const [expand, setExpand] = useState(false);
    const [trackerDatasets, setTrackerDatasets] = useState([]);

    const dispatch = useDispatch();
    const statsAvailable = [
        { name: 'Min prices', field: 'minPrice' },
        { name: 'Max prices', field: 'maxPrice' },
        { name: 'Average prices', field: 'averagePrice' },
        { name: 'Median prices', field: 'medianPrice' },
        { name: 'Converged' }
    ];

    function formatDataset(airfares){
        return airfares.map(({startDate, endDate, airfares}, idx) => {
            return {
                label: formatRangeDates(startDate, endDate),
                data: airfares.map((r) => ({ 
                    t: r.createdAt, 
                    y: r[statsAvailable.find((s) => s.name === statSelected).field] 
                })),
                borderColor: graphColors[idx],
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                fill: false
            }
        });
    }

    function formatDatasetAdditional(stats){
        return stats.map(({name, data}, idx) => {
            return {
                label: name,
                data: data.map(({date, value}) => ({ 
                    t:  moment(new Date(date)).format('dddd DD MMMM YYYY'), 
                    y: value
                })),
                borderColor: graphColors[idx],
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                fill: false
            }
        });
    }

    useEffect(() => {
        let airfares = tracker.airfares;

        setNoData(airfares && airfares.length === 0);

        if (!airfares) return;

        let datasets = [];
        switch (statSelected) {
            case 'Min prices':
            case 'Max prices':
            case 'Average prices':
            case 'Median prices':
                datasets = formatDataset(airfares);
                break;

            case 'Converged':
                datasets = formatDatasetAdditional(tracker.additionnalStats);
                break;
            default:
                break;
        }

        setTrackerDatasets(datasets);
    }, [tracker, statSelected]);

    function computeMergedStats(airfares){
        let allAirfares = airfares.map(a => a.airfares).flat();
        let minPrices = new Map(), maxPrices = new Map(), averagePrices = new Map();

        for(let airfare of allAirfares){
            let {year, month, day} = breakDownDate(airfare.createdAt);
            let key = `${year}-${month}-${day}`;

            let {minPrice, maxPrice, averagePrice} = airfare;
            minPrices.set(key, minPrices.has(key) ? Math.min(minPrices.get(key), minPrice) : minPrice);
            maxPrices.set(key, maxPrices.has(key) ? Math.max(maxPrices.get(key), maxPrice) : maxPrice);
            averagePrices.set(key, averagePrices.has(key) ? [...averagePrices.get(key), averagePrice] : [averagePrice]);
        }

        for(let [key, value] of averagePrices.entries()){
            averagePrices.set(key, value.reduce((acc, val, _, arr) => (acc + (val / arr.length)), 0).rounding(2))
        }
        
        return [
            {name: 'Min prices', data: [...minPrices].map(([date, value]) => ({ date, value }))},
            {name: 'Max prices', data: [...maxPrices].map(([date, value]) => ({ date, value }))},
            {name: 'Average prices', data: [...averagePrices].map(([date, value]) => ({ date, value }))},
        ];
    }

    function sortRandomColors(){
        let tempColors = [...GRAPH_COLORS];
        let randColors = [], random;
        
        while(tempColors.length > 0){
            random = Math.floor(Math.random() * tempColors.length);
            randColors.push(tempColors.splice(random, 1)[0]);
        }

        setGraphColors(randColors);
    }

    useEffect(() => {
        let mounted = true;

        sortRandomColors();

        DataService.trackerById(props.tracker.id).then((tracker) => {
            
            if (mounted) {
                //Update single tracker when fetched
                setIsLoaded(true);
                let convergedStats = computeMergedStats(tracker.airfares);
                tracker.additionnalStats = convergedStats;
                dispatch(updateSingleTracker(tracker));
            }
        }).catch((e) => {
            console.log(e.message);
            //dispatch(updateSingleTracker({}))
        });

        return () => {
            mounted = false;
        }
    }, []);


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
                
                {tracker && <TrackerControls tracker={tracker}/>} 
                <div className="separator"></div>
                {displayGraph()}
            </div>
        </div>
    )
}


/**
 *
 */

 /*let map = new Map();
        for(let airfare of allAirfares){
            
            let {year, month, day} = breakDownDate(airfare.createdAt);
            let key = `${year}-${month}-${day}`;
            map.set(key, map.has(key) ? [...map.get(key), airfare] : [airfare]);
        }

        let stats = [];
        const initStat = {
            minPrice: Infinity,
            maxPrice: -Infinity,
            averagePrice: 0
        };
        for (const [key, value] of map.entries()) {
            stats.push({
                date: key,
                data: value.reduce((acc, val, _, arr) => ({
                    minPrice: Math.min(val.minPrice, acc.minPrice),
                    maxPrice: Math.max(val.maxPrice, acc.maxPrice),
                    averagePrice: acc.averagePrice + (val.averagePrice / arr.length),
                }), initStat)
            })
        }

        return stats*/