import ControlTable from "../controls/ControlTables";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";


export default function LightControls(props: { ioc: IocState, setter: SetterFn }) {


    return <Section title="💡 Lights">
        <ControlTable 
            ioc={props.ioc}
            setter={props.setter}
            controls={[
                {
                    label: "Headlights",
                    key: "headlights",
                },
                {
                    label: "Taillights",
                    key: "taillights",
                }
            ]}
        />
    </Section>
}