import React, {useState, useEffect} from 'react';
import './Home.scss'
import {AirportTable} from '../airport-table/AirportTable';
import {DataService} from '../../services/dataService';

export const Home = (props) => {
    const [nearestAirport, setNearestAirport] = useState();
    
    useEffect(() => {
        // Fetch
        console.log('HELLO');
        //DataService.postIP();
        /*DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
          console.log(res);
        });
    
        DataService.getFrequentTrackers().then((res) => {
          console.log(res);
        });*/
    
        DataService.getUserInfo().then(res => {
          console.log(res);
          if(res){
            setNearestAirport(res.closestAirport);
          }
        })
    }, [])

    return(
        <div id="home">
            <div>Home</div>
            
            <AirportTable nearestAirport={nearestAirport}/>
        </div>
    )
}