import React, { useEffect, useState, useCallback } from 'react';
import Chart from 'chart.js';

import './LineChart.scss'

export const LineChart = (props) => {
    const [chart, setChart] = useState();

    const initChart = useCallback(() => {
        let ctx = document.getElementById(props.chartID);

        setChart(new Chart(ctx, {
            type: 'line',
            data: { datasets: props.datasets },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear'
                    }]
                },
                legend: {
                    display: true,
                    labels: {
                        /*fontSize: '12'*/
                        /*fontColor: 'rgb(255, 99, 132)',*/
                    }
                },
                title: {
                    display: false,
                    text: 'Minimum price over time',
                    position: 'left'
                },
                animation: {
                    duration: 5000,
                    onComplete: () => { }
                },
                responsive: true,
                maintainAspectRatio: props.maintainAspectRatio,
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 5,
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 4,
                        label: {
                            enabled: false,
                            content: 'Test label'
                        }
                    }]
                }
            }
        }));
    })

    function update() {
        let tChart = chart;
        tChart.data.datasets = props.datasets;
        setChart(tChart);
        chart.update(500);
    }

    useEffect(() => {
        if (props.datasets.length === 0) return;

        if (!chart) initChart();
        else update();

    }, [props.datasets])

    return (
        <div className="line-chart">
            <canvas id={props.chartID} width="250" height="150"></canvas>
        </div>
    )
}