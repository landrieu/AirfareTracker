import React from 'react';
import './Toggle.scss';

import { LDSSpinner } from './Loaders';

export const Toggle = (props) => {
    function displayLoader() {
        if (props.isLoading) {
            return (<LDSSpinner width='20px' height='20px' size={props.loaderSize} />);
        }

        return '';
    }

    return (
        <div className='toggle-container'>
            <div className={`toggle ${props.isActive ? 'on' : 'off'} ${props.isLoading ? 'loading' : ''}`} onClick={props.onClick}>
                <div className='toggle-slider'>{props.isActive ? 'ON' : 'OFF'}</div>
            </div>
            <div className='toggle-loading'>
                {displayLoader()}
            </div>
        </div>
    )
}
