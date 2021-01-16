import React, { useEffect, useState } from 'react';

import { DataService } from '../../../services/dataService/';
import { useDispatch, useSelector } from 'react-redux';

import { updateSingleTracker } from '../../../redux/MyTrackers/actions';
import { breakDownDate } from '../../../helpers/date';

import { TrackerControls } from '../TrackerControls/TrackerControls';
import { TrackerGraph } from '../TrackerGraph/TrackerGraph';
import { LDSSpinner } from '../../misc/Loaders';

import './SingleTracker.scss';

export const SingleTracker = (props) => {
    const tracker = useSelector(state => state.myTrackers.trackers.find(t => t.id === props.tracker.id));
    const [isLoaded, setIsLoaded] = useState(false);
    const [noData, setNoData] = useState(true);
    const [expand, setExpand] = useState(props.expandInit || false);

    const dispatch = useDispatch();


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


    useEffect(() => {
        let mounted = true;

        DataService.trackerById(props.tracker.id).then((tracker) => {
            
            if (mounted) {
                setNoData(!tracker.airfares || tracker.airfares.length === 0);
                //Update single tracker when fetched
                let convergedStats = computeMergedStats(tracker.airfares);
                tracker.additionnalStats = convergedStats;
                dispatch(updateSingleTracker(tracker));
            }
        }).catch((e) => {
            console.log(e.message);
            //dispatch(updateSingleTracker({}))
        }).finally(() => {
            setIsLoaded(true);
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

    return (
        <div key={props.index} className={`single-tracker ${isLoaded ? '' : 'disabled'}`}>
            <div className="single-tracker-top-container">
                <div className="single-tracker-top">
                    <span>{tracker.from ? tracker.from.city : ''} - {tracker.to ? tracker.to.city : ''}</span>
                    {displayExpand()}
                </div>
            </div>
            <div className={`single-tracker-body ${expand ? 'expand' : ''} ${noData ? 'no-data' : ''}`}>
                {tracker && <TrackerControls tracker={tracker}/>} 
                <div className="separator"></div>
                {tracker && <TrackerGraph index={props.index} tracker={tracker} noData={noData}/>}
            </div>
        </div>
    )
}

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