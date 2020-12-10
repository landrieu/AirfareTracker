import './Dates.scss'

export const Dates = (props) => {

    function onSubmit(){
        props.nextStep(1);
    }

    function backStep(){
        if(!props.isActive){
            props.nextStep('Dates');
        }
    }

    const activeDisplay = (
        <div>
            <div className="inline-fields">
                <div>
                    <input type="text" id="departure-date-from" placeholder="Departure date from" value={props.departureDates} onChange={(e) => props.setDepartureDates(e.currentTarget.value)}/>
                </div>
                <div>
                    <input type="text" id="departure-date-to" placeholder="Departure date to"/>
                </div>
            </div>
            <div id="location-button" className="button" onClick={onSubmit}>
                <button>Submit</button>
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
        <div id="step-dates" className={setClassNames()} style={props.stepStyle} onClick={backStep}>
            {selectDisplay()}
        </div>
    )
}