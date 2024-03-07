import ControlTable from "../controls/ControlTables";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";


export default function Settings(props: { ioc: IocState, setter: SetterFn }) {


    return <Section title="⚙️ Settings">
        <ControlTable 
            ioc={props.ioc}
            setter={props.setter}
            controls={[
                {
                    label: "Cam Pan - Trim",
                    key: "pan_trim",
                },
                {
                    label: "Cam Tilt - Trim",
                    key: "tilt_trim",
                }
            ]}
        />
    </Section>
}