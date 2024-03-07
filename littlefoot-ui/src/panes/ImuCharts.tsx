import Chart, { DefaultChartParams } from "../instruments/Chart";
import { IocFloatOutput, IocState } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";



export default function ImuCharts(props: {ioc: IocState}) {

    const ioc = props.ioc;
    const accel_x: IocFloatOutput | null = ioc.outputs["accel_x"] && "Float" in ioc.outputs["accel_x"] ? ioc.outputs["accel_x"].Float : null;
    const accel_y: IocFloatOutput | null = ioc.outputs["accel_y"] && "Float" in ioc.outputs["accel_y"] ? ioc.outputs["accel_y"].Float : null;
    const accel_z: IocFloatOutput | null = ioc.outputs["accel_z"] && "Float" in ioc.outputs["accel_z"] ? ioc.outputs["accel_z"].Float : null;
    
    const mag_x: IocFloatOutput | null = ioc.outputs["mag_x"] && "Float" in ioc.outputs["mag_x"] ? ioc.outputs["mag_x"].Float : null;
    const mag_y: IocFloatOutput | null = ioc.outputs["mag_y"] && "Float" in ioc.outputs["mag_y"] ? ioc.outputs["mag_y"].Float : null;
    const mag_z: IocFloatOutput | null = ioc.outputs["mag_z"] && "Float" in ioc.outputs["mag_z"] ? ioc.outputs["mag_z"].Float : null;
    
    const gyro_x: IocFloatOutput | null = ioc.outputs["gyro_x"] && "Float" in ioc.outputs["gyro_x"] ? ioc.outputs["gyro_x"].Float : null;
    const gyro_y: IocFloatOutput | null = ioc.outputs["gyro_y"] && "Float" in ioc.outputs["gyro_y"] ? ioc.outputs["gyro_y"].Float : null;
    const gyro_z: IocFloatOutput | null = ioc.outputs["gyro_z"] && "Float" in ioc.outputs["gyro_z"] ? ioc.outputs["gyro_z"].Float : null;
    
    return <>
        <Section title = "📉 Raw imu sensor values">
            <div className="row">
                <div className="col">
                    <Chart 
                        title="Accelerometer (gs)" 
                        historySeconds={10} 
                        seconds={ioc.time?.seconds}
                        data={[
                            {label: "x", value: accel_x ? accel_x : undefined, color: "red"}, 
                            {label: "y", value: accel_y ? accel_y : undefined, color: "green"}, 
                            {label: "z", value: accel_z ? accel_z : undefined, color: "blue"}
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
                            {label: "x", value: mag_x ? mag_x : undefined, color: "red"}, 
                            {label: "y", value: mag_y ? mag_y : undefined, color: "green"}, 
                            {label: "z", value: mag_z ? mag_z : undefined, color: "blue"}
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
                            {label: "x", value: gyro_x ? gyro_x : undefined, color: "red"}, 
                            {label: "y", value: gyro_y ? gyro_y : undefined, color: "green"}, 
                            {label: "z", value: gyro_z ? gyro_z : undefined, color: "blue"}
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