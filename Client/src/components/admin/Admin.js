import React, { useEffect, useState } from 'react';
import './Admin.scss';

import moment from 'moment';
import { DataService } from '../../services/dataService/';


export const Admin = (props) => {
    const [IPs, setIPs] = useState([]);
    const [trackers, setTrackers] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        DataService.getGlobalStats().then(({ success, data, message }) => {
            if(success) setStats(data);
            else console.log(message);
        }).catch((e) => {
            console.log(e.message);
        });

        DataService.getLastIPs().then(({ success, data, message }) => {
            if (success) setIPs(data);
            else console.log(message);
        }).catch((e) => {
            console.log(e.message);
        });

        DataService.getLastTrackers().then(({ success, data, message }) => {
            if (success) setTrackers(data);
            else console.log(message);
        }).catch((e) => {
            console.log(e.message);
        });
    }, []);

    return (
        <div id="admin">
            <div id="admin-container">
                <div id="admin-dashboard">
                    <div className="admin-stat">
                        <div className="stat-name">Visitors number</div>
                        <div className="stat-value">{stats.nbVisitors}</div>
                    </div>
                    <div className="admin-stat">
                        <div className="stat-name">Users number</div>
                        <div className="stat-value">{stats.nbUsers}</div>
                    </div>
                    <div className="admin-stat">
                        <div className="stat-name">Trackers N number</div>
                        <div className="stat-value">{stats.nbTrackersN}</div>
                    </div>
                    <div className="admin-stat">
                        <div className="stat-name">Trackers number</div>
                        <div className="stat-value">{stats.nbTrackers}</div>
                    </div>
                    <div className="admin-stat">
                        <div className="stat-name">Trackers F number</div>
                        <div className="stat-value">{stats.nbTrackersF}</div>
                    </div>
                </div>
                <div id="admin-tables">
                    <table id="admin-ips">
                        <thead>
                            <tr>
                                <th>IP address</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {IPs.map((IP, idx) => {
                                return (
                                    <tr key={idx} className="ip">
                                        <td>{IP.address}</td>
                                        <td>{IP.city}</td>
                                        <td>{IP.countryCode}</td>
                                        <td>{moment(IP.createdAt).format('DD/MM/YYYY')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <table id="admin-trackers">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Type</th>
                                <th>User</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {trackers.map((tracker, idx) => {
                                return (
                                    <tr key={idx} className="tracker">
                                        <td>{tracker.from.city}</td>
                                        <td>{tracker.to.city}</td>
                                        <td>{tracker.type}</td>
                                        <td>{tracker.userEmail}</td>
                                        <td>{moment(tracker.createdAt).format('DD/MM/YYYY')}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}