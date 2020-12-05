import React, {useEffect} from 'react';
import './AirportTable.scss';
import {AirportTableCase} from './airport-table-case/AirportTableCase';

export const AirportTable = (props) => {
    

    return(
        <div id="airport-table">
            <div id="nearest-airport">
                <div>Nearest airport:</div>
                <div id="letters-slide">
                    {(new Array(15)).fill(0).map((_, i) => <AirportTableCase nearestAirport={props.nearestAirport} key={i} n={i}/>)}
                </div>
            </div>
        </div>
    )
}