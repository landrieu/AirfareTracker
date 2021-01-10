import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { DataService } from './services/dataService';
import { Header } from './components/header/Header';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { SetTracker } from './components/set-tracker/SetTracker';
import { Home } from './components/home/Home';
import { MyTrackers } from './components/my-trackers/MyTrackers';

import { authService } from './services/authService';

import { TRACKER_STATUS, errorMessages } from './services/appConstant';
import { updateNearestAirport, updateNearestTrackers, updateNearestTrackersStatus, updateSingleNearestTracker } from './redux/HomeInfo/actions';

import './App.scss';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(authService.loggedIn());

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('APP INIT')
        authService.subscribe(setIsLoggedIn);

        retrieveData();
    }, []);

    const retrieveData = useCallback(() => {

        DataService.getClosestTrackers().then(trackers => {
            if (!trackers) {
                dispatch(updateNearestTrackersStatus(null, TRACKER_STATUS.FAIL, errorMessages.connectionIssue));
                return;
            }
            dispatch(updateNearestTrackers(trackers, TRACKER_STATUS.INIT));
                /*{
                    updateType: ,
                    data: trackers
                }
            ));*/
            fetchTrackers(trackers);

        }).catch(err => {
            //Failed to fetch IP info
            console.log(err);
            dispatch(updateNearestTrackersStatus(null, TRACKER_STATUS.FAIL, errorMessages.connectionIssue));
            /*dispatch(updateNearestTrackers(
                {
                    updateType: 'status',
                    data: {
                        status: TRACKER_STATUS.FAIL,
                        error: errorMessages.connectionIssue
                    }
                }
            ));*/
        });

        DataService.getClosestAirport().then(nearestAirport => {
            dispatch(updateNearestAirport(nearestAirport));
        }).catch((e) => {
            console.log(e);
            dispatch(updateNearestAirport(null));
        })
    });

    function fetchTrackers(trackers) {
        trackers.forEach((t) => {
            dispatch(updateNearestTrackersStatus(t.id, TRACKER_STATUS.LOADING, null));
            /*dispatch(updateNearestTrackers(
                {
                    updateType: 'status',
                    data: { status: TRACKER_STATUS.LOADING }
                }
            ));*/

            DataService.airfaresByTrackerId(t.id).then(({ trackerId, tracker }) => {
                //Update single tracker when fetched
                dispatch(updateSingleNearestTracker(trackerId, tracker, TRACKER_STATUS.COMPLETE));
                /*dispatch(updateNearestTrackers(
                    {
                        updateType: TRACKER_STATUS.COMPLETE,
                        trackerId,
                        data: data
                    }
                ));*/
            }).catch(err => {
                //Failed to fetch specific tracker
                console.log(err);
                dispatch(updateNearestTrackersStatus(t.id, TRACKER_STATUS.FAIL, errorMessages.connectionIssue));
                /*dispatch(updateNearestTrackers(
                    {
                        updateType: 'status',
                        trackerId: t.id,
                        data: {
                            status: TRACKER_STATUS.FAIL,
                            error: errorMessages.connectionIssue
                        }
                    }
                ));*/
            });
        });
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            isLoggedIn
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    )

    return (
        <Router>
            <div>
                <Header />

                <Switch>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/set-tracker">
                        <SetTracker />
                    </Route>
                    <PrivateRoute exact path="/my-trackers" component={MyTrackers} />
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>

    );
}



