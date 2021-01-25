import React from 'react';
import './Home.scss'
import {AirportTable} from '../airport-table/AirportTable';
import {FrequentRoutes} from '../frequent-routes/FrequentRoutes';
import { Info } from './info/Info';

import { useSelector } from 'react-redux';

export const Home = (props) => {
    //const nearestAirport = useSelector(state => state.homeInfo.nearestAirport);
    const nearestTrackers = useSelector(state => state.homeInfo.nearestTrackers);

    return(
        <div id="home">
            <div id="home-frequent-routes">
                <FrequentRoutes trackers={nearestTrackers}/>
                <AirportTable/>
            </div>
            <Info />
        </div>
        
    )
}