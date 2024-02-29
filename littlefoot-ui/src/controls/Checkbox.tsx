import {useEffect, useState} from 'react';
import { IocBoolInput } from "../ioc/IocWebsocketClient";


interface CheckboxProps {
    input: IocBoolInput,
    label: String,
    callback: (value: boolean) => void,
}


export default function Checkbox(props: CheckboxProps) {

    let [value, setValue] = useState(props.input.value);

    useEffect(() => {
        props.callback(value);
    }, [value])

    return <div>
        <b>{props.label}</b>
        <input 
            type="checkbox"
            checked={value}
            onChange={evt => setValue(evt.target.checked)}
        />
        &nbsp;
        {props.input.value}
    </div>
}