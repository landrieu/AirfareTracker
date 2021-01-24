import React, { useEffect, useState, useCallback } from 'react';
import Chart from 'chart.js';

import moment from 'moment'
import './LineChart.scss'

export const LineChart = (props) => {
    const [chart, setChart] = useState();

    const initChart = useCallback(() => {
        let ctx = document.getElementById(props.chartID);

        setChart(new Chart(ctx, {
            type: 'line',
            data: { datasets: props.datasets },
            options: {
                //https://www.chartjs.org/docs/latest/general/performance.html
                //showLines: false, // disable for all datasets
                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
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
                /*animation: {
                    duration: 5000,
                    onComplete: () => { }
                },*/
                responsive: true,
                maintainAspectRatio: props.maintainAspectRatio,
                /*tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {
                            console.log(tooltipItem, data);
                            return moment(tooltipItem[0]['label']).format('DD MM YY')
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: function (tooltipItem, data) {
                            console.log(tooltipItem, data);
                            return data['datasets'][0]['data'][tooltipItem['index']];
                        }
                    },
                    backgroundColor: '#FFF',
                    titleFontSize: 16,
                    titleFontColor: '#0066ff',
                    bodyFontColor: '#000',
                    bodyFontSize: 14,
                    displayColors: false
                },*/
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 150,
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