import React, { useState, useEffect } from 'react';
import './AccountActivation.scss';

import { DataService } from '../../services/dataService';
import { LDSRing } from '../misc/Loaders';

export const AccountActivation = ({match}) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let userId = match.params.id;
        if(!userId){
            setMessage('Incorrect path!');
            setLoading(false);
        } 


        setLoading(true);
        DataService.activateAccount(userId).then((res) => {
            setMessage(res.success ? 'Your account is now active!' : res.error);
        }).catch(e => {
            setMessage(e.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [match]);

    function display(){
        if (loading) return <span><LDSRing /></span>
        else return (
            <div>{message}</div>
        );
    }

    return (
        <div id="account-activation">
            {display()}
        </div>
    )
}