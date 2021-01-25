import React, { useEffect, useState } from 'react';
import { Card } from './elements/Card';

import { useDispatch, useSelector } from 'react-redux';

import './FrequentRoutes.scss'

export const FrequentRoutes = (props) => {
    const [sliderXPosition, setSliderXPosition] = useState(0);
    const trackers = useSelector(state => state.homeInfo.nearestTrackers);
    const [nbCardToDisplay, setNbCardToDisplay] = useState(2);
    const [displayedCard, setDisplayedCard] = useState(0);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}

    function clickArrow(e, direction) {
        e.preventDefault();
        let stepSize = (100 / 6) * nbCardToDisplay;
        console.log(direction, sliderXPosition, Math.abs(sliderXPosition) + stepSize, stepSize);
        if (direction === 'left' && sliderXPosition >= 0) {
            return;
        }

        if (direction === 'right' && Math.abs(sliderXPosition) + stepSize >= 100) {
            return;
        }

        
        stepSize = direction === 'right' ? -stepSize : stepSize;
        setDisplayedCard(displayedCard  + (direction === 'right' ? nbCardToDisplay: -nbCardToDisplay));

        setSliderXPosition(sliderXPosition + stepSize);
    }

    function changeCardSize() {
        let element = document.getElementById('section-1');
        if (!element) return;
        let positionInfo = element.getBoundingClientRect();
        let width = positionInfo.width;

        if (width < 960) {
            setNbCardToDisplay(1);
        } else {
            setNbCardToDisplay(2);
            if(displayedCard % 2 !== 0){
                setDisplayedCard(displayedCard - 1);
                let stepSize = (100 / 6);
                setSliderXPosition(sliderXPosition - stepSize);
            }
        }
    }



    useEffect(() => {
        changeCardSize();
        window.addEventListener('resize', changeCardSize.bind(this));

        return () => {
            window.removeEventListener('resize', changeCardSize.bind(this));
        }
    }, []);

    const cardStyle = {
        width: `calc(100% / 6)`

    }

    const sliderStyle = {
        transform: `translateX(${sliderXPosition}%)`,
        width: `calc(100% * ${6 / nbCardToDisplay})`
    }

    return (
        <div id="home-frequent">
            <div id="left-arrow-container">
                <div id="left-arrow" onClick={(e) => clickArrow(e, 'left')}>
                    <img src={process.env.PUBLIC_URL + "/icons/arrow_left.svg"} alt="Right arrow"></img>
                </div>
            </div>
            <div id="section-1">
                <div id="section-1-left-gradient"></div>
                <div id="section-1-right-gradient"></div>
                <div id="section-2" style={sliderStyle}>

                    {trackers.map((tracker, index) => {
                        return <Card style={cardStyle} key={index} index={index} tracker={tracker} trackerId={tracker.id} />
                    })}

                </div>
            </div>
            <div id="right-arrow-container">
                <div id="right-arrow" onClick={(e) => clickArrow(e, 'right')}>
                    <img src={process.env.PUBLIC_URL + "/icons/arrow_left.svg"} alt="Left arrow"></img>
                </div>
            </div>
        </div>

    )
}