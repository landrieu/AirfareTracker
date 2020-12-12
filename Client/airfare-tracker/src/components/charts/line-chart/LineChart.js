import React, {useEffect} from 'react';
import Chart from 'chart.js';

import './LineChart.scss'

export const LineChart = (props) => {
    let chart;
    const availableColors = ['rgba(154, 62, 235, 1)', 'rgba(54, 162, 235, 1)'];

    useEffect(() => {
        //if(props.datasets.length === 0) return
        //let myChart = new Chart(ctx, {...});
        let data = [1, 2, 10, 25, 10];
        let options = {};
        let ctx = document.getElementById(props.chartID);
        console.log(props.datasets);
        chart = new Chart(ctx, {
            type: 'line',
            data: {datasets: props.datasets || []},/*{
                //labels: ["2015-03-15T13:03:00Z", "2015-03-25T13:02:00Z", "2015-04-25T14:12:00Z"],
                datasets: [{
                  label: 'Demo',
                  data: [{
                      t: "2015-03-15T13:03:00Z",
                      y: 12
                    },
                    {
                      t: "2015-03-25T13:02:00Z",
                      y: 21
                    },
                    {
                      t: "2015-04-25T14:12:00Z",
                      y: 32
                    }
                  ],
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2
                }, {
                    label: 'Demo 2',
                    data: [{
                        t: "2015-03-15T13:03:00Z",
                        y: 16
                      },
                      {
                        t: "2015-03-25T13:02:00Z",
                        y: 41
                      },
                      {
                        t: "2015-04-20T14:12:00Z",
                        y: 56
                      }
                    ],
                    borderColor: 'rgba(154, 62, 235, 1)',
                    borderWidth: 2
                  }]
              },*/
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
            /*options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }*/
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear'
                    }]
                }
            }
        });
    }, [props.datasets])

    return(
        <div className="line-chart">
            <canvas id={props.chartID} width="250" height="150"></canvas>
        </div>
    )
}