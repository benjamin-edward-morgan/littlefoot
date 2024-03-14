import { IocState } from "../ioc/IocWebsocketClient"


interface OutputTableRowProp {
    label: String,
    key: string
}

interface OutputTableProps {
    outputs: OutputTableRowProp[],
    ioc: IocState,
}

function make_row(row: OutputTableRowProp, ioc: IocState) {
    let output = ioc.outputs[row.key];
    let value = "null";

    if(output && "Float" in output && output.Float.value != undefined) {
        value = output.Float.value.toString();
    } else if(output && "Bool" in output && output.Bool.value != undefined) {
        if(output.Bool.value) {
            value = "✔︎ true"
        } else {
            value = "✗ false"
        }
    } else if(output && "String" in output && output.String.value != undefined) {
        value = output.String.value
    }
    return <div className="row" key={row.key}>
        <div className="col2">
            {row.label}
        </div>
        <div className="col">
            {value}
        </div>
    </div>
}

export default function OutputTable(props: OutputTableProps) {

    return <div className="col">
        {props.outputs.map(outp => make_row(outp, props.ioc))}
    </div>

}