import React from 'react';
import './Info.scss'

export const Info = (props) => {
    return (
        <div id="home-info">
            <div id="home-info-container">
                <div className="home-info-card">
                    <div className="top">
                        <img src="./images/bell.svg" alt='Bell'></img>
                    </div>
                    <div className="bottom">
                        Visualize the evolution of the airfare along the time, we scan the market 3 times a day to allow you to find the best price.
                        </div>
                </div>
                <div className="home-info-card">
                    <div className="top">
                        <img src="./images/line-graph.svg" alt='Graph'></img>
                    </div>
                    <div className="bottom">
                        Set a tracker among XXX airports select departure, arrival airport and a departure arrival range date
                        </div>
                </div>
                <div className="home-info-card">
                    <div className="top">
                        <img src='./images/target.svg' alt='Target'></img>
                    </div>
                    <div className="bottom">
                        Set a tracker among XXX airports select departure, arrival airport and a departure arrival range date
                    </div>
                </div>
            </div>
        </div>
    )
}