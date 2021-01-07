import React from 'react';
import './Alert.scss';
import { saveForm, updateForm } from '../../../redux/SetTracker/actions';

import { useDispatch, useSelector} from 'react-redux';


export const Alert = (props) => {
    //const [emailError, setEmailError] = useState('');
    const priceTrigger = useSelector(state => state.setTracker.priceTrigger);
    const alertEnabled = useSelector(state => state.setTracker.alertEnabled);
    const dispatch = useDispatch();

    function onSubmit(){
        props.nextStep(1);
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Alert');
        }
    }

    function setPriceTrigger(value){
        dispatch(updateForm({priceTrigger: value}));
    }

    function setAlertEnabled(value){
        dispatch(updateForm({alertEnabled: value}));
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <input type="number" placeholder="Trigger price (€)" value={priceTrigger} onChange={e => setPriceTrigger(e.currentTarget.value)}></input>
            </div>
            <div>
                Enable alert<input className="alert-checkbox" type="checkbox" value={alertEnabled} onChange={e => setAlertEnabled(e.currentTarget.checked)}></input>
            </div>
            <div id="alert-button" className="button" onClick={onSubmit}>
                <button>{props.buttonLabel}</button>
            </div>
        </div>
    );

    const unactiveDisplay = (
        <div>
            Not active
        </div>
    )

    function selectDisplay(){
        return props.isActive ? activeDisplay : unactiveDisplay;
    }

    function setClassNames(){
        let classNames = "step";
        if(props.isActive) classNames += " active";
        if(props.isVisible) classNames += " visible";
        return classNames;
    }

    return (
        <div id="step-alert" className={setClassNames()} style={props.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}