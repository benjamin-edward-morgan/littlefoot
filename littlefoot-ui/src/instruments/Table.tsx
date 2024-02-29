import { IocBoolOutput, IocFloatOutput, IocStringOutput } from "../ioc/IocWebsocketClient";


interface TableRowProp {
    name: String,
    value: IocFloatOutput | IocBoolOutput | IocStringOutput | null
}


export function TableRow(props: { row: TableRowProp }) {

    let value = (props.row.value == null || props.row.value.value == null ? "null" : props.row.value.value.toString());

    return <tr>
        <td>
            { props.row.name }
        </td>
        <td>
            { value} 
        </td>
    </tr>
}

export default function Table(props: { title: String, rows: TableRowProp[] }) {

    return <table>
        <thead>
            <tr>
                <td>
                    {props.title}
                </td>
            </tr>
        </thead>
        <tbody>
            {props.rows.map(row => <TableRow row={row}/>)}
        </tbody>
    </table>



}