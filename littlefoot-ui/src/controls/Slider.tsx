import {useEffect, useState} from 'react';
import { IocFloatInput } from '../ioc/IocWebsocketClient';


interface SliderProps {
    input: IocFloatInput,
    label: String,
    callback: (value: number) => void
}


export default function Slider(props: SliderProps) {


    let [value, setValue] = useState(props.input.value);

    useEffect(() => {
        console.log("set: " + value)
        props.callback(value);
    }, [value])

    return <div>
        <b>{props.label}</b>
        <input 
            type="range"
            min={props.input.min}
            max={props.input.max} 
            step={props.input.step} 
            value={value}
            onChange={evt => setValue(parseFloat(evt.target.value))}
        />
        &nbsp; 
        {props.input.value}
    </div>
}