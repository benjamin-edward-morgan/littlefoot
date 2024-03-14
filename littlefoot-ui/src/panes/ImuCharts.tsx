import Chart, { DefaultChartParams } from "../instruments/Chart";
import { IocArrayOutput, IocState } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";



export default function ImuCharts(props: {ioc: IocState}) {

    const ioc = props.ioc;

    const accel_out = ioc.outputs["accelerometer"];
    const accel: IocArrayOutput | null = accel_out && "Array" in accel_out ? accel_out.Array : null;

    const mag_out = ioc.outputs["magnetometer"];
    const mag: IocArrayOutput | null = mag_out && "Array" in mag_out ? mag_out.Array : null;

    const gyro_out = ioc.outputs["gyroscope"];
    const gyro: IocArrayOutput | null = gyro_out && "Array" in gyro_out ? gyro_out.Array : null;

    return <>
        <Section title = "📉 Raw imu sensor values">
            <div className="row">
                <div className="col">
                    <Chart 
                        title="Accelerometer (gs)" 
                        historySeconds={10} 
                        seconds={ioc.time?.seconds}
                        data={[
                            {label: "x", value: accel ? (accel.value[0] as number) : undefined, color: "red"}, 
                            {label: "y", value: accel ? (accel.value[1] as number) : undefined, color: "green"}, 
                            {label: "z", value: accel ? (accel.value[2] as number) : undefined, color: "blue"}
                        ]}
                        params={{
                            ... DefaultChartParams,
                            range: [-2, 2],
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Chart 
                        title="Magnetometer (gauss)" 
                        historySeconds={10} 
                        seconds={ioc.time?.seconds}
                        data={[
                            {label: "x", value: mag ? (mag.value[0] as number) : undefined, color: "red"}, 
                            {label: "y", value: mag ? (mag.value[1] as number) : undefined, color: "green"}, 
                            {label: "z", value: mag ? (mag.value[2] as number) : undefined, color: "blue"}
                        ]}
                        params = {{
                            ... DefaultChartParams,
                            range: [-0.05, 0.05],
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Chart 
                        title="Gyroscope (deg/s)" 
                        historySeconds={10} 
                        seconds={ioc.time?.seconds}
                        data={[
                            {label: "x", value: gyro ? (gyro.value[0] as number) : undefined, color: "red"}, 
                            {label: "y", value: gyro ? (gyro.value[1] as number) : undefined, color: "green"}, 
                            {label: "z", value: gyro ? (gyro.value[2] as number) : undefined, color: "blue"}
                        ]}
                        params = {{
                            ... DefaultChartParams,
                            range: [-50.0, 50.0],
                        }}
                    />
                </div>
            </div>
            <div className="row" >
                <div className="col">
                    <span className="legendChip" style={{backgroundColor: "red"}}></span>    
                    <span>x</span>
                </div>
                <div className="col">
                    <span className="legendChip" style={{backgroundColor: "green"}}></span>    
                    <span>y</span>

                </div>
                <div className="col">
                    <span className="legendChip" style={{backgroundColor: "blue"}}></span>    
                    <span>z</span>
                </div>
            </div>
        </Section>
        
    </>
}