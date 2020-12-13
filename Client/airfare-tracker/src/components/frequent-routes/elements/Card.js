import React, { useCallback, useEffect, useState } from 'react';
import {LineChart} from '../../charts/line-chart/LineChart';

import { NICE_NAMES, GRAPH_COLORS } from '../../../services/appConstant';
import './Card.scss'

export const Card = (props) => {
    //const [sliderXPosition, setSliderXPosition] = useState(0);
    const [trackerDatasets, setTrackerDatasets] = useState([]);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}

    const setDatasets = useCallback(() => {
        if(!props.tracker.airfares) return [];

        let airfares = props.tracker.airfares;   
        let tempColors = [...GRAPH_COLORS];          
        let datasets = airfares.map((a) => {
            return {
                label: NICE_NAMES[a.term],
                data: a.data.map((r) => ({t: r.createdAt, y: r.minPrice})),
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
    }, [props.tracker]);

    useEffect(() => {
        setDatasets();
    }, [props.tracker, setDatasets]);

    

    const displayTop = () => {
        switch (props.tracker.status) {
            case 'init': return '';
            case 'loading': return '' 
            case 'fail': return props.tracker.error;
            case 'complete': return `From ${props.tracker.from.city} to ${props.tracker.to.city}`;        
            default: return ''
        }
    }

    return(
        <div className="card" key={props.tracker.id}>
            <div className={`card-container ${props.tracker.status}`}>
                <div className="top">
                    <div className="top-container">{displayTop()}</div>
                </div>
                <div className="middle">
                    <div className="info">
                        <div className="container">

                        </div>
                    </div>
                    <div className="info">
                        <div className="container">
                            
                        </div>
                    </div>
                </div>
                <div className="bottom">
					<LineChart datasets={trackerDatasets} chartID={`frequent-route-${props.index}`}/>
                </div>
            </div>
        </div>
    )
}

/*airfares.reduce((acc, cur) => {
            let id = `${cur.occurrence.interval}${cur.occurrence.length}`;
            if(map[id] === undefined){
                acc.push([cur]);
                map[id] = acc.length - 1;
            }else{
                acc[map[id]].push(cur);
            }
                return acc;
        }, []).map(airfares => airfares.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))*/