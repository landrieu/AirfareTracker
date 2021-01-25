## Description

This project allows users to create airfares trackers in order to buy a flight ticket at the best moment.  
Technologies: __Node JS__, Express, MongoDB, __GraphQL__, __React JS__, Redux

## Features

Here are the featrures available for any user:
1. Create a tracker
2. Find a tracker via the tracker ID
3. Visualize the evolution of the price, with different charts
4. Set up a tracker with specific information
5. Create an account

## Structure

The projects is divided in three parts:
* __Server__: Back-end, GraphQL API
* __Client__: Front-end developed with React JS
* __Routine__: Scripts that will scan airfares regularly

## Web application 

### Dashboard

On the dashboard different information are given.  
The _nearest airport_ should be displayed based on the client IP address.  
Some predefined _trackers_ (6 by default) are also displayed. Once again based on the client IP, the most interesting trackers are retrieved.

For example: If the client is based in Sydney, trackers shown will be the ones that have a departure or return airport the closest to Sydney.  

### Set a tracker

Any user can create a new tracker. If not registered the user must provide an email address. Then the user can select the departure and arrival airports from a list. The next step is to select the departure and return dates. The user can select a range. The last step is to set up a trigger price, in order to receive an email if a price below that limit is detected. 

### Find a tracker

For unregistered user, it's possible to observe the evolution. This user will just have to provide the tracker ID.

### My trackers

From that page, a registered user can see all the trackers he created. The tracker information are displayed (tracker ID, airports dates, status), and also some charts (Min prices, max prices, average prices, median prices and cmbines).  
It is also possible to update some parameters such as tracker's status, alert's status and trigger price.

## Restrictions

A registered user can have up to 6 active trackers.  
A unregistered user can have up to 3 active trackers.

## Development ideas

Display a list of frequent trackers, with advanced statistics and charts.  
Price projection based on history and indicators such as the standard deviation.  
Handle different currencies. By default the application supports only Euros.  
