import React, {useEffect, useState} from 'react';
import './AirportTableCase.scss';
//import styled, { keyframes, css} from "styled-components";

export const AirportTableCase = (props) => {

    const [characters] = useState(() => { 
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('');
        const randomNum = Math.floor(Math.random() * chars.length)
        return [...chars.slice(randomNum, chars.length), ...chars.slice(0, randomNum)];
    });

    const [letterSpinnerStyle, setLetterSpinnerStyle] = useState();
    
    useEffect(() => {
        if(!props.nearestAirport) return;

        let airport = props.nearestAirport.city.toUpperCase();
        let letter = airport.charAt(props.n);

        setTimeout(() => {
            setLetterSpinnerStyle({
                animationIterationCount: 0, 
                top: `-${characters.indexOf(letter || ' ') * 33}px`,
            });
        }, props.n * 150);
        
    }, [props.nearestAirport])

    /*let LetterSpinnerContainer = styled.div(() => {
        const letterSpinnerAnim = keyframes`
            0% {top: 0px;}
            100% {top: -${33*26}px;}`;

        return css`
            animation: ${letterSpinnerAnim} 5s linear infinite alternate-reverse;
        `;
    })*/


    return(
        
        <div className="letter-case">
            <div className="letter-spinner-container" style={letterSpinnerStyle}>
            {characters.map(l => (<div key={`${props.n}-${l}`} className="letter-spinner">{l}</div>))}
            </div>
        </div>
                    

    )
}

/*function selectRandomChar(){
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    let randomChar = characters.charAt(getRandomNumber(charactersLength));
    return randomChar;
}*/
/*
<LetterSpinnerContainer className="letter-spinner-container">
</LetterSpinnerContainer>
*/
