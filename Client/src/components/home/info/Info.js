import React from 'react';
import './Info.scss'

export const Info = (props) => {
    return (
        <div id="home-info">
            <div id="home-info-container">
                <div className="home-info-card">
                    <div className="top">
                        <img src={process.env.PUBLIC_URL + '/images/bell.svg'} alt='Bell'></img>
                    </div>
                    <div className="bottom">
                        You can enable an alert to receive an alert by email if the airfare goes under a treshold that you fixed.
                        </div>
                </div>
                <div className="home-info-card">
                    <div className="top">
                        <img src={process.env.PUBLIC_URL + '/images/line-graph.svg'} alt='Graph'></img>
                    </div>
                    <div className="bottom">
                    Visualize the evolution of the prices along the time. The market is scanned 3 times a day to allow, to find the best price.
                        </div>
                </div>
                <div className="home-info-card">
                    <div className="top">
                        <img src={process.env.PUBLIC_URL + '/images/target.svg'} alt='Target'></img>
                    </div>
                    <div className="bottom">
                        Set a tracker among XXX airports. Select departure, arrival airports and a departure arrival range dates.
                    </div>
                </div>
            </div>
        </div>
    )
}