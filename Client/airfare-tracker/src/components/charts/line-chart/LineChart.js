import React, {useEffect} from 'react';
import Chart from 'chart.js';

import './LineChart.scss'

export const LineChart = (props) => {
    let chart;

    useEffect(() => {
        //let myChart = new Chart(ctx, {...});
        let data = [1, 2, 10, 25, 10];
        let options = {};
        let ctx = document.getElementById(props.chartID);
        chart = new Chart(ctx, {
            type: 'line',
            data: props.data,
            /*{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: 
                [{
                    label: 'Short term',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2
                }]
            },*/
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }, [])

    return(
        <div className="line-chart">
            <canvas id={props.chartID} width="250" height="150"></canvas>
        </div>
    )
}