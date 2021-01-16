import React from 'react';
import './Alert.scss';
import { updateForm } from '../../../redux/SetTracker/actions';

import { useDispatch, useSelector} from 'react-redux';

export const Alert = (props) => {
    const triggerPrice = useSelector(state => state.setTracker.triggerPrice);
    const email = useSelector(state => state.setTracker.email);
    const dispatch = useDispatch();

    function onSubmit(){
        props.nextStep(1);
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Alert');
        }
    }

    function setTriggerPrice(value){
        dispatch(updateForm({triggerPrice: Number(value)}));
    }

    const activeDisplay = (
        <div>
            <div className="tip">
                You can set a trigger price. If an airfare is below that price, an email will be sent to {email}.
            </div>
            <div className="inline-fields trigger-price">
                <input type="number" placeholder="Trigger price (€)" value={triggerPrice || ''} onChange={e => setTriggerPrice(e.currentTarget.value)}></input>
            </div>
            <div id="alert-button" className="button" onClick={onSubmit}>
                <button className={`${props.isLoading ? 'loading' : ''}`}>{props.buttonLabel}</button>
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

/*const alertEnabled = useSelector(state => state.setTracker.alertEnabled);
function setAlertEnabled(value){
    dispatch(updateForm({alertEnabled: value}));
}
<div>
Enable alert<input className="alert-checkbox" type="checkbox" value={alertEnabled} onChange={e => setAlertEnabled(e.currentTarget.checked)}></input>
</div>*/