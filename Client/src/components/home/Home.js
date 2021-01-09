import React, {useState, useEffect, useCallback, useReducer} from 'react';
import './Home.scss'
import {AirportTable} from '../airport-table/AirportTable';
import {FrequentRoutes} from '../frequent-routes/FrequentRoutes';
import { Info } from './info/Info';
//import {DataService} from '../../services/dataService';

import { useDispatch, useSelector } from 'react-redux';

export const Home = (props) => {
    const nearestAirport = useSelector(state => state.homeInfo.nearestAirport);
    const nearestTrackers = useSelector(state => state.homeInfo.nearestTrackers);

    const dispatch = useDispatch();

    const [cardWidth, setCardWidth] = useState(0);


    function changeCardSize(){
        let sizeWindow = window.innerWidth;
        let sizeCard = 0;

        if(sizeWindow < 768){
            sizeCard = 100;
        }else if(sizeWindow >= 768 && sizeWindow < 1024){
            sizeCard = 50;
        }else if(sizeWindow >= 1024 && sizeWindow < 1280){
            sizeCard = (1/3) * 100;
        }else{
            sizeCard = 25;
        }
        //console.log('SIWE', sizeCard);
        setCardWidth(sizeCard);
    }

    
    
    useEffect(() => {
        // Fetch
        //console.log('HELLO');
        //changeCardSize();
        //window.addEventListener('resize', changeCardSize.bind(this));
        
        // returned function will be called on component unmount 
        return () => {
            window.removeEventListener('resize', changeCardSize.bind(this));
        }
    }, []);

    return(
        <div id="home">
            <div id="home-frequent-routes">
                <FrequentRoutes trackers={nearestTrackers}/>
                <AirportTable nearestAirport={nearestAirport}/>
            </div>
            <Info />
        </div>
        
    )
}