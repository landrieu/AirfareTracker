import React, { useCallback, useEffect, useState } from 'react';
import { LineChart } from '../../charts/line-chart/LineChart';

import { NICE_NAMES, GRAPH_COLORS, TRACKER_STATUS } from '../../../services/constants';
import { useSelector } from 'react-redux';

import './Card.scss';

export const Card = ({ style, trackerId, index }) => {
    const [randomWidth] = useState(() => {
        let rand1 = Math.floor(Math.random() * 60) + 40;
        let rand2 = Math.floor(Math.random() * 60) + 40;
        return [rand1, rand2];
    });

    const tracker = useSelector(state => state.homeInfo.nearestTrackers.find(t => t.id === trackerId));

    const chartOptions = {
        maintainAspectRatio: true,
        title: {
            display: true,
            position: 'bottom',
            fontColor: 'white',
            fontStyle: 'normal',
            fontFamily: 'Bellota',
            text: 'Average price evolution on departure date'
        },
        legend: {
            display: true,

        },
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'linear',
                ticks: {
                    fontSize: '10'
                }
            }],
            yAxes: [{

                ticks: {
                    fontSize: '10'
                }
            }]

        }
    };
    const [stats, setStats] = useState(() => {
        return new Array(2).fill({ text: '', value: '' });
    });
    //const [sliderXPosition, setSliderXPosition] = useState(0);
    const [trackerDatasets, setTrackerDatasets] = useState([]);
    //let sliderStyle = {transform: `translateX(${sliderXPosition}%)`}

    const setDatasets = useCallback(() => {
        if (!tracker.airfares) return [];

        let airfares = tracker.airfares;
        //let tempColors = [...GRAPH_COLORS]; 
        const terms = ['short_term', 'medium_term', 'long_term'];
        airfares.sort((a, b) => terms.indexOf(a.term) - terms.indexOf(b.term));
        let datasets = airfares.map((a, index) => {
            return {
                label: NICE_NAMES[a.term],
                data: a.data.map((r) => ({ t: r.createdAt, y: r.averagePrice })),
                borderColor: function () {
                    return GRAPH_COLORS[index];
                    //let random = Math.floor(Math.random() * tempColors.length);
                    //return tempColors.splice(random, 1)[0];
                }(),
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                //backgroundColor: 'red',
                fill: false
            }
        });

        setTrackerDatasets(datasets);

        setStats(tracker.stats);
    }, [tracker]);

    useEffect(() => {
        if (tracker.status === TRACKER_STATUS.COMPLETE && trackerDatasets.length === 0) {
            setDatasets();
        }

    }, [tracker, setDatasets]);

    const displayTop = () => {
        switch (tracker.status) {
            case TRACKER_STATUS.INIT: return '';
            case TRACKER_STATUS.LOADING: return ''
            case TRACKER_STATUS.FAIL: return tracker.error;
            case TRACKER_STATUS.COMPLETE: return `From ${tracker.from.city} to ${tracker.to.city}`;
            default: return '';
        }
    }

    const displayStat = (stat) => {
        switch (tracker.status) {
            case TRACKER_STATUS.INIT: return '';
            case TRACKER_STATUS.LOADING: return ''
            case TRACKER_STATUS.FAIL: return '';
            case TRACKER_STATUS.COMPLETE: return `${stat ? stat.text : ''} ${stat ? stat.value : ''}`;
            default: return '';
        }
    }

    function defineWidthLoading(idx) {
        if (tracker.status === TRACKER_STATUS.COMPLETE) return '100%'
        //console.log(randomWidth[0])
        return `${randomWidth[idx]}%`;
    }

    return (
        <div className="card" key={tracker.id} style={style}>
            <div className={`card-container ${tracker.status.toLowerCase()}`}>
                <div className="top">
                    <div className="top-container">{displayTop()}</div>
                </div>
                <div className="middle">
                    {stats.map((stat, idx) => (
                        <div className="info" key={idx}>
                            <div className="container" style={{ width: defineWidthLoading(0) }}>
                                {displayStat(stat)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bottom">
                    <LineChart datasets={trackerDatasets} chartID={`frequent-route-${index}`} options={chartOptions} />
                </div>
            </div>
        </div>
    )
}

/*airfares.reduce((acc, cur) => {
            let id = `${cur.occurrence.interval}${cur.occurrence.length}`;
            if(map[id] === undefined){
                acc.push([cur]);
                map[id] = acc.length - 1;
            }else{
                acc[map[id]].push(cur);
            }
                return acc;
        }, []).map(airfares => airfares.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))*/