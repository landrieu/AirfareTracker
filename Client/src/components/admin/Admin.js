import React, { useEffect, useState } from 'react';
import './Admin.scss';

import moment from 'moment';
import { DataService } from '../../services/dataService/';


export const Admin = (props) => {
    const [IPs, setIPs] = useState([]);

    useEffect(() => {
        DataService.getLastIPs().then(({ success, data, message }) => {
            console.log(success, data);
            if (success) setIPs(data);
        }).catch((e) => {

        });
    }, []);

    return (
        <div id="admin">
            <table id="admin-ips">
                <tr>
                    <th>IP address</th>
                    <th>City</th>
                    <th>country</th>
                    <th>Date</th>
                </tr>


                {IPs.map((IP, idx) => {
                    return (
                        <tr key={idx} className="ip">
                            <th>{IP.address}</th>
                            <th>{IP.city}</th>
                            <th>{IP.countryCode}</th>
                            <th>{moment(IP.createdAt).format('DD/MM/YYYY')}</th>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}