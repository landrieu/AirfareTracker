import React, { useEffect, useState } from 'react';
import {LineChart} from '../../charts/line-chart/LineChart';

import './Card.scss'

export const Card = (props) => {
    const [sliderXPosition, setSliderXPosition] = useState(0);
    const [trackerDatasets, setTrackerDatasets] = useState([]);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}
    const data = [{
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: 
        [{
            label: 'Short term',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        },{
            label: 'Middle term',
            data: [15, 14, 5, 8, 4, 6],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        }]
    },{
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: 
        [{
            label: 'Short term',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    }];

    useEffect(() => {
        setDatasets();
    }, [props.tracker]);

    const setDatasets = () => {
        console.log('he', props.tracker.airfares)
        if(!props.tracker.airfares) return [];
        const availableColors = ['rgba(154, 62, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', '#4bc0c0', '#e4e5e7'];
        let airfares = props.tracker.airfares; 
        let map = {};
            // id, data, position
        let datasets = airfares.reduce((acc, cur) => {
            let id = `${cur.occurrence.interval}${cur.occurrence.length}`;
            if(map[id] === undefined){
                acc.push([cur]);
                map[id] = acc.length - 1;
            }else{
                acc[map[id]].push(cur);
            }
                return acc;
        }, []).map(airfares => airfares.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))
        .map((a, i) => {
            let tempColors = availableColors;
            return {
                label: `Short term ${i}`,
                data: a.map((r) => ({t: r.createdAt, y: r.minPrice})),
                borderColor: function(){
                    let random = Math.floor(Math.random() * tempColors.length);
                    let l = tempColors.splice(random, 1)[0];
                    return l;
                }(),
                borderWidth: 2
            }
        });
        console.log(datasets);
            
        setTrackerDatasets(datasets);
    }

    const displayTop = () => {
        if(props.tracker.from){
            return `From ${props.tracker.from.city} to ${props.tracker.to.city}`;
        }else return '';
    }

    return(
        <div className="card" key={props.tracker.id}>
            <div className={`card-container ${props.tracker.status}`}>
                <div className="top">
                    <div>{displayTop()}</div>
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
