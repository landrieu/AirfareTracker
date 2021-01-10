import React, { useEffect, useState } from 'react';
import './AirportTable.scss';
import { AirportTableCase } from './airport-table-case/AirportTableCase';
import { useSelector } from 'react-redux';

export const AirportTable = (props) => {
    const [displayFull, setDisplayFull] = useState(false);
    const nearestAirport = useSelector(state => state.homeInfo.nearestAirport);

    const firstInit = () => !nearestAirport.updatedAt;

    useEffect(() => {
        if (nearestAirport) {
            let delay = firstInit ? (15 * 150) : 0
            setTimeout(() => {
                setDisplayFull(true);
            }, delay);

        } else {
            setDisplayFull(false);
        }
    }, [nearestAirport]);

    function airportFullInfo() {
        if (displayFull && nearestAirport.airport) {
            return (
                <span id="nearest-airport-desc">{nearestAirport.airport.name} - {nearestAirport.airport.city} ({nearestAirport.airport.iataCode})</span>);
        }
    }

    return (
        <div id="airport-table">
            <div id="nearest-airport">
                <div id="nearest-airport-text">Nearest airport:</div>
                <div id="nearest-airport-info">
                    <div id="letters-slide">
                        {(new Array(15)).fill(0).map((_, i) => <AirportTableCase nearestAirport={nearestAirport} key={i} n={i} />)}
                    </div>
                    <div id="full-info">
                        {airportFullInfo()}
                    </div>
                </div>
            </div>
        </div>
    )
}