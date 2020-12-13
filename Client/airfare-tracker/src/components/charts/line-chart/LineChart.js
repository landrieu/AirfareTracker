import React, {useEffect, useState} from 'react';
import Chart from 'chart.js';

import './LineChart.scss'

export const LineChart = (props) => {
    //let chart;
    const [chart, setChart] = useState();

    useEffect(() => {
        if(props.datasets.length === 0) return

        let ctx = document.getElementById(props.chartID);
        console.log(props.datasets);
        setChart(new Chart(ctx, {
            type: 'line',
            data: {datasets: props.datasets},
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear'
                    }]
                },
                title: {
                    display: false,
                    text: 'Minimum price over time',
                    position: 'left'
                },
                animation: {
                    duration: 5000,
                    onComplete: () => {}
                }
            }
        }));
    }, [props.datasets])

    return(
        <div className="line-chart">
            <canvas id={props.chartID} width="250" height="150"></canvas>
        </div>
    )
}