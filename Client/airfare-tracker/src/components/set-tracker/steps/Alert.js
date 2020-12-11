import './Alert.scss'

export const Alert = (props) => {

    function onSubmit(){
        props.nextStep(1);
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Alert');
        }
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <input type="number" placeholder="Price limit"></input>
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