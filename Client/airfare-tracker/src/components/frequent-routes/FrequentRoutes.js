import React, { useEffect, useState } from 'react';
import { Card } from './elements/Card';

import './FrequentRoutes.scss'

export const FrequentRoutes = (props) => {
    const [sliderXPosition, setSliderXPosition] = useState(0);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}

    function clickArrow(e, direction){
        e.preventDefault();
        //console.log(`DIR${direction}`);
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
                <img src="./icons/arrow_left.svg" alt="Right arrow"></img>
            </div>
            <div id="section-1">
                <div id="section-1-left-gradient"></div>
                <div id="section-1-right-gradient"></div>
                <div id="section-2" style={{transform: `translateX(${sliderXPosition}%)`}}>
				
                    {props.trackers.map((tracker, index) => {
						return <Card key={index} index={index} tracker={tracker}/>
                    })}
                    
                </div>
            </div>
            <div id="right-arrow" onClick={(e) => clickArrow(e, 'right')}>
                <img src="./icons/arrow_left.svg" alt="Left arrow"></img>
            </div>
        </div>
        
    )
}