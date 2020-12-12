import React, {useState, useEffect, useCallback, useReducer} from 'react';
import './Home.scss'
import {AirportTable} from '../airport-table/AirportTable';
import {FrequentRoutes} from '../frequent-routes/FrequentRoutes';
import {DataService} from '../../services/dataService';

export const Home = (props) => {
    const [nearestAirport, setNearestAirport] = useState();
    //const [trackers, setTrackers] = useState([]);
    const [cardWidth, setCardWidth] = useState(0);

    const [trackers, setTrackers] = useReducer((arr, {updateType, trackerId, data}) => {
        switch (updateType) {
            case 'init':
                return data.map(el => ({...el,status: 'initialized'}));
            case 'status':
                if(trackerId) return arr.map(el => (el.id === trackerId ? {...el, ...data} : el))
                else return arr.map(el => ({...el, ...data}))
            case 'final':
                return arr.map(el => (el.id === trackerId ? {...el, airfares: data.airfares} : el))        
            default: console.log(`Update type not recognized: ${updateType}`);
                break;
        }
        //if(!trackerId) return data;

        //return arr.map(el => (el.id === trackerId ? {...el, airfares: data} : el))
    }, (new Array(6)).fill({status: 'inactive'}));

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
        console.log('SIWE', sizeCard);
        setCardWidth(sizeCard);
    }

    function fetchTrackers(trackers){
        trackers.forEach((t, index) => {
            setTrackers({updateType: 'status', trackerId: 'all', data: {status: 'loading'}});
            DataService.airfaresByTrackerId(t.id).then(({trackerId, airfares}) => {
                setTrackers({updateType: 'final', trackerId, data: {airfares}});
            })
        });
    }

    const retrieveData = useCallback(() => {
        DataService.getUserInfo().then(res => {
            if(res.success){
                setNearestAirport(res.closestAirport);
                setTrackers({updateType: 'init', data: res.closestTrackers});
                fetchTrackers(res.closestTrackers);
            }
        });
    });
    
    useEffect(() => {
        // Fetch
        console.log('HELLO');
        //changeCardSize();
        //window.addEventListener('resize', changeCardSize.bind(this));
        
        //retrieveData();

        /*DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
            console.log(res);
          });*/
        //DataService.postIP();
        /*DataService.getUserWithEmail('lio23@hotmail.fr').then((res) => {
          console.log(res);
        });
    
        DataService.getFrequentTrackers().then((res) => {
          console.log(res);
        });*/
    
        /*DataService.getUserInfo().then(res => {
          console.log(res);
          if(res){
            setNearestAirport(res.closestAirport);
          }
        })*/

        /*setTimeout(() => {
            setNearestAirport({city: 'Los Angeles', name: 'Airport of Los Angeles', iataCode: 'LAX'});
        },1000);*/
        // returned function will be called on component unmount 
        return () => {
            window.removeEventListener('resize', changeCardSize.bind(this));
        }
    }, []);

    return(
        <div id="home">
            <div id="home-frequent-routes">
                <FrequentRoutes trackers={trackers}/>
                <AirportTable nearestAirport={nearestAirport}/>
            </div>
            <div id="home-info">
                <div id="home-info-container">
                    <div className="home-info-card">
                        <div className="top">
                            <img src="./images/bell.svg"></img>
                        </div>
                        <div className="bottom">
                            Visualize the evolution of the airfare along the time, we scan the market 3 times a day to allow you to find the best price.
                        </div>
                    </div>
                    <div className="home-info-card">
                        <div className="top">
                            <img src="./images/line-graph.svg"></img>
                        </div>
                        <div className="bottom">
                            Set a tracker among XXX airports select departure, arrival airport and a departure arrival range date
                        </div>
                    </div>
                    <div className="home-info-card">
                    <div className="top">
                            <img src="./images/target.svg"></img>
                        </div>
                        <div className="bottom">
                            Set a tracker among XXX airports select departure, arrival airport and a departure arrival range date
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}