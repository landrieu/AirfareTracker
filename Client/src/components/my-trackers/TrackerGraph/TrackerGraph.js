import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { GRAPH_COLORS, GRAPH_STATS_AVAILABLE, DEFAULT_GRAPH_STAT, ERRORS } from '../../../services/constants';
import { formatRangeDates } from '../../../helpers/date';
import { LineChart } from '../../charts/line-chart/LineChart';

import './TrackerGraph.scss';

export const TrackerGraph = ({ tracker, index, noData }) => {

    const [statSelected, setStatSelected] = useState(DEFAULT_GRAPH_STAT);
    const [graphColors, setGraphColors] = useState([]);

    const [trackerDatasets, setTrackerDatasets] = useState([]);

    function sortRandomColors() {
        let tempColors = [...GRAPH_COLORS];
        let randColors = [], random;

        while (tempColors.length > 0) {
            random = Math.floor(Math.random() * tempColors.length);
            randColors.push(tempColors.splice(random, 1)[0]);
        }

        setGraphColors(randColors);
    }

    function formatDataset(airfares) {
        return airfares.map(({ startDate, endDate, airfares }, idx) => {
            return {
                label: formatRangeDates(startDate, endDate),
                data: airfares.map((r) => ({
                    t: r.createdAt,
                    y: r[Object.values(GRAPH_STATS_AVAILABLE).find((s) => s.name === statSelected).field]
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

    function formatDatasetAdditional(stats) {
        return stats.map(({ name, data }, idx) => {
            return {
                label: name,
                data: data.map(({ date, value }) => ({
                    t: moment(new Date(date)).format('dddd DD MMMM YYYY'),
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
        //Tracker has been updated locally, do not re-render the graph

        let { airfares } = tracker;
        if (!airfares) return;

        let datasets = [];
        switch (statSelected) {
            case GRAPH_STATS_AVAILABLE.MIN_PRICES.name:
            case GRAPH_STATS_AVAILABLE.MAX_PRICES.name:
            case GRAPH_STATS_AVAILABLE.AVERAGE_PRICES.name:
            case GRAPH_STATS_AVAILABLE.MEDIAN_PRICES.name:
                datasets = formatDataset(airfares);
                break;

            case GRAPH_STATS_AVAILABLE.COMBINED.name:
                datasets = formatDatasetAdditional(tracker.additionnalStats);
                break;
            default:
                break;
        }

        setTrackerDatasets(datasets);
    }, [tracker.airfares, statSelected]);

    function render() {
        if (noData) {
            return (
                <div className="no-data">
                    <span className="no-data-label">{ERRORS.GRAPH_NO_DATA}</span>
                </div>
            )
        }

        return (
            <div className="my-tracker-graph">
                <div className="stats-available">
                    {Object.values(GRAPH_STATS_AVAILABLE).map((stat, index) =>
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