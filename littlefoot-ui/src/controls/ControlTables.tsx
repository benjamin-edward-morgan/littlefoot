import { useState, useEffect } from "react"
import { IocBoolInput, IocFloatInput, IocState, SetterFn } from "../ioc/IocWebsocketClient"

interface ControlRowProps {
    label: String,
    key: string,
}

interface ControlTableProps {
    controls: ControlRowProps[],
    ioc: IocState,
    setter: SetterFn,
}

function FloatControlRow(props: {label: String, id: string, input: IocFloatInput, setter: SetterFn}) {

    let [value, setValue] = useState(props.input.value)

    useEffect(() => {
        props.setter([{
            k: props.id,
            v: value
        }]);
    }, [value]);

    return <div className="row">
        <div className="col2">
            {props.label}
        </div>
        <div className="col3">
            <input 
                min={props.input.min}
                max={props.input.max}
                step={props.input.step}
                value={value}
                onChange={evt => setValue(parseFloat(evt.target.value))}
                type="range"
            ></input>
        </div>
        <div className="col">
            {props.input.value}
        </div>
    </div>
}

function BoolControlRow(props: {label: String, id: string, input: IocBoolInput, setter: SetterFn}) {

    let [value, setValue] = useState(props.input.value)

    useEffect(() => {
        props.setter([{
            k: props.id,
            v: value,
        }]);
    }, [value])

    return <div className="row">
        <div className="col2">
            {props.label}
        </div>
        <div className="col3">
            <input 
                type="checkbox" 
                onChange={evt => setValue(evt.target.checked)}
            />
        </div>
        <div className="col">
            {props.input.value ? "✔︎" : "✗"}
        </div>
    </div>
}

function make_control(row: ControlRowProps, ioc: IocState, setter: SetterFn) {
    let input = ioc.inputs[row.key];
    if(input && "Float" in input) {
        return <FloatControlRow key={row.key} id={row.key} label={row.label} input={input.Float} setter={setter} />
    } else if(input && "Bool" in input) {
        return <BoolControlRow key={row.key} id={row.key} label={row.label} input={input.Bool} setter={setter} />
    } else {
        return null      
    }
}

export default function ControlTable(props: ControlTableProps) {

    return <div className="col">
        {props.controls.map(ctrl => make_control(ctrl, props.ioc, props.setter))}
    </div>
}