import OutputTable from "../instruments/OutputTable";
import { IocState } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";



export default function OtherSensors(props: { ioc: IocState}) {

    return <Section title="🌡️ Environmental Sensors">
        <OutputTable
            ioc={props.ioc}
            outputs={[
                {
                    key: "temperature",
                    label: "Temperature (°c)",
                },
                {
                    key: "pressure",
                    label: "Atmospheric Pressure (mbar)",
                }
            ]}
        />
    </Section>


}