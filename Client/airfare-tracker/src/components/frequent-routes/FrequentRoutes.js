import React, { useEffect, useState } from 'react';
import { Card } from './elements/Card';

import './FrequentRoutes.scss'

export const FrequentRoutes = (props) => {
    const [sliderXPosition, setSliderXPosition] = useState(0);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}
    const data = [{
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
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
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
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

    function clickArrow(e, direction){
        e.preventDefault();
        console.log(`DIR${direction}`);
        let stepSize = (100 / 6) * 2;
        if(direction === 'right') stepSize = -stepSize;
        setSliderXPosition(sliderXPosition + stepSize);
        //sliderStyle.transform = sliderXPosition + stepSize;
	}
	
	/*useEffect(() =>{
		console.log('dz', props.trackers)
	}, [props.trackers]);*/

    return(
        <div id="home-frequent">
            <div id="left-arrow" onClick={(e) => clickArrow(e, 'left')}>
                <img src="./icons/arrow_left.svg"></img>
            </div>
            <div id="section-1">
                <div id="section-1-left-gradient"></div>
                <div id="section-1-right-gradient"></div>
                <div id="section-2" style={{transform: `translateX(${sliderXPosition}%)`}}>
				
                    {props.trackers.map((tracker, index) => {
						return <Card key={index} index={index} tracker={tracker} data={data[0]}/>
                    })}
                    
                </div>
            </div>
            <div id="right-arrow" onClick={(e) => clickArrow(e, 'right')}>
                <img src="./icons/arrow_left.svg"></img>
            </div>
        </div>
        
    )
}

/**
 * <div className="card">
                        <div className="card-container">
                            <div className="top">From Barcelona to Paris</div>
                            <div className="bottom">
                                <LineChart data={data[0]} chartID="frequent-route-1"/>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-container">
                            <div className="top">From Barcelona to Paris</div>
                            <div className="bottom">
                                <LineChart data={data[1]} chartID="frequent-route-2"/>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-container">
                            <div className="top">From Barcelona to Paris</div>
                            <div className="bottom">
                                <LineChart data={data[2]} chartID="frequent-route-3"/>
                            </div>
                        </div>
                    </div>
                    <div className="card"> D</div>
                    <div className="card"> E</div>
                    <div className="card"> F</div>
 */