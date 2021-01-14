import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { GRAPH_COLORS } from '../../../services/appConstant';
import { formatRangeDates } from '../../../helpers/date';
import { LineChart } from '../../charts/line-chart/LineChart';

import './TrackerGraph.scss';

export const TrackerGraph = ({tracker, index, noData}) => {

    const [statSelected, setStatSelected] = useState('Min prices');
    const [graphColors, setGraphColors] = useState([]);

    const [trackerDatasets, setTrackerDatasets] = useState([]);

    const statsAvailable = [
        { name: 'Min prices', field: 'minPrice' },
        { name: 'Max prices', field: 'maxPrice' },
        { name: 'Average prices', field: 'averagePrice' },
        { name: 'Median prices', field: 'medianPrice' },
        { name: 'Converged' }
    ];

    function sortRandomColors(){
        let tempColors = [...GRAPH_COLORS];
        let randColors = [], random;
        
        while(tempColors.length > 0){
            random = Math.floor(Math.random() * tempColors.length);
            randColors.push(tempColors.splice(random, 1)[0]);
        }

        setGraphColors(randColors);
    }

    function formatDataset(airfares){
        return airfares.map(({startDate, endDate, airfares}, idx) => {
            return {
                label: formatRangeDates(startDate, endDate),
                data: airfares.map((r) => ({ 
                    t: r.createdAt, 
                    y: r[statsAvailable.find((s) => s.name === statSelected).field] 
                })),
                borderColor: graphColors[idx],
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                fill: false
            }
        });
    }

    function formatDatasetAdditional(stats){
        return stats.map(({name, data}, idx) => {
            return {
                label: name,
                data: data.map(({date, value}) => ({ 
                    t:  moment(new Date(date)).format('dddd DD MMMM YYYY'), 
                    y: value
                })),
                borderColor: graphColors[idx],
                pointRadius: 1,
                pointHoverRadius: 2,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', //'default',
                fill: false
            }
        });
    }

    useEffect(() => {
        sortRandomColors();
    }, [])

    useEffect(() => {
        let airfares = tracker.airfares;
        if (!airfares) return;

        let datasets = [];
        switch (statSelected) {
            case 'Min prices':
            case 'Max prices':
            case 'Average prices':
            case 'Median prices':
                datasets = formatDataset(airfares);
                break;

            case 'Converged':
                datasets = formatDatasetAdditional(tracker.additionnalStats);
                break;
            default:
                break;
        }

        setTrackerDatasets(datasets);
    }, [tracker, statSelected]);

    function render() {
        if (noData) {
            return (
                <div className="no-data">
                    <span className="no-data-label">No data available</span>
                </div>
            )
        }

        return (
            <div className="my-tracker-graph">
                <div className="stats-available">
                    {statsAvailable.map((stat, index) =>
                        <span onClick={() => setStatSelected(stat.name)} className={`stat ${statSelected === stat.name ? 'selected' : ''}`} key={index}>{stat.name}</span>)
                    }
                </div>
                <LineChart datasets={trackerDatasets} maintainAspectRatio={false} chartID={`frequent-route-${index}`} />
            </div>
        )
    }

    return (
        <div>
            {render()}
        </div>
    )
}