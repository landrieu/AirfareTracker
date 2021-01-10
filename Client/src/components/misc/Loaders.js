import React from 'react';
import './Loaders.scss';

import styled, { keyframes, css } from "styled-components";


export const LDSSpinner = (props) => {
    const style = {
        width: props.width || '80px',
        height: props.height || '80px',
    };

    /*
    const ldsRipple = keyframes`
    0% {
        top: ${props.width ? props.width / 2 : '36px'};
        left: ${props.width ? props.width / 2 : '36px'};
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        top: 0px;
        left: 0px;
        width: ${props.width ? props.width : '72px'};
        height: ${props.width ? props.width : '72px'};;
        opacity: 0;
    }
    `;

    const spinStyle = styled.div`
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        borderRadius: 50%;
        animation: ${ldsRipple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    `;*/

    return(
        <div className="lds-ripple" style={style}>
            <div className={`${props.size ? props.size : ''}`}></div>
            <div className={`${props.size ? props.size : ''}`}></div>
        </div>    
    )
}

export const LDSRing = (props) => {
    const style = {
        width: props.width || '80px',
        height: props.height || '80px',
    };

    return(
        <div className="lds-ring" style={style}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>  
    )
}