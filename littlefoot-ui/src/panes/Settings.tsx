import InputTable from "../controls/InputTable";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";


export default function Settings(props: { ioc: IocState, setter: SetterFn }) {


    return <Section title="⚙️ Settings">
        <InputTable 
            ioc={props.ioc}
            setter={props.setter}
            controls={[
                {
                    label: "Cam Enabled",
                    key: "enable_camera",
                },
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