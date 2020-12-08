import React, {useEffect, useState} from 'react';
import './AirportTable.scss';
import {AirportTableCase} from './airport-table-case/AirportTableCase';

export const AirportTable = (props) => {
    const [displayFull, setDisplayFull] = useState(false);

    useEffect(() => {
        if(props.nearestAirport){
            setTimeout(() => {
                setDisplayFull(true);
            }, 15 * 150);
            
        }else{
            setDisplayFull(false);
        }
    }, [props.nearestAirport]);

    return(
        <div id="airport-table">
            <div id="nearest-airport">
                <div>Nearest airport:</div>
                <div id="nearest-airport-info">
                    <div id="letters-slide">
                        {(new Array(15)).fill(0).map((_, i) => <AirportTableCase nearestAirport={props.nearestAirport} key={i} n={i}/>)}
                    </div>
                    <div id="full-info">
                        { displayFull && <span id="nearest-airport-desc">{props.nearestAirport.name} - {props.nearestAirport.city} ({props.nearestAirport.iataCode})</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}