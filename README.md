## Description

This project allows users to create airfares trackers in order to buy a flight ticket at the best moment.
Technologies: __Node JS__, Express, MongoDB, __GraphQL__, __React JS__, Redux

## Features

Here are the featrures availble for any user:
1. Create a tracker
2. Find a tracker via the tracker ID
3. Visualize the evolution of the price, with different charts

## Structure

The projects is divided in three parts:
⋅⋅* __Server__: Back-end, GraphQL API
⋅⋅* __Client__: Front-end developed with React JS
⋅⋅* __Routine__: Scripts that will scan airfares regularly

## Web application 

### Dashboard

On the dashboard different information are given.
The _nearest airport_ should be displayed based on the client IP address. 
Some predefined _trackers_ (6 by default) are also displayed. Once again based on the client IP, the most interesting trackers are retrieved.

For example: If the client is based in Sydney, trackers shown will be the ones that have a departure or return airport the closest to Sydney.

### Set a tracker

### Find a tracker

## Development ideas

Display a list of frequent trackers, with advanced statistics and charts.
Price projection based on history and indicators such as the standard deviation.
