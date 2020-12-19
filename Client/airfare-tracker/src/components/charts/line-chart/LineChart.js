import React, {useEffect, useState, useCallback} from 'react';
import Chart from 'chart.js';

import './LineChart.scss'

export const LineChart = (props) => {
    const [chart, setChart] = useState();

    const initChart = useCallback(() => {
        let ctx = document.getElementById(props.chartID);

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
    })

    useEffect(() => {
        if(props.datasets.length === 0) return;
        
        if(!chart) initChart();
        
        
    }, [props.datasets])

    return(
        <div className="line-chart">
            <canvas id={props.chartID} width="250" height="150"></canvas>
        </div>
    )
}