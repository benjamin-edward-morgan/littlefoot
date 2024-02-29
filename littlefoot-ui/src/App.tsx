import TouchPad, { TouchPadState } from "./controls/TouchPad";
import Slider from "./controls/Slider";
import useIocWebsocketClient, { IocBoolInput, IocFloatInput, IocFloatOutput } from './ioc/IocWebsocketClient';
import { useCallback, useState } from "react";
import Checkbox from "./controls/Checkbox";
import Table from "./instruments/Table";


export default function App() {

  const websocketUrl = "ws://" + window.location.host + "/ws";
  const streamImageUrl = "http://" + window.location.host + "/stream";

  // const websocketUrl = "ws://turdatron.local:8080/ws";
  // const streamImageUrl = "http://turdatron.local:8080/stream";

  // const websocketUrl = "ws://beefbox.local:8080/ws";
  // const streamImageUrl = "http://beefbox.local:8080/stream";


  const [ioc, setter] = useIocWebsocketClient(websocketUrl);

  const [lastPan, setLastPan] = useState(0.0);
  const [lastTilt, setLastTilt] = useState(0.0);
  const [lastSteer, setLastSteer] = useState(0.0);
  const [lastDrive, setLastDrive] = useState(0.0);


  const panTiltCallback = useCallback( (panTilt: TouchPadState | null) => {
    let new_pan = panTilt ? panTilt.dx : 0.0;
    let new_tilt = panTilt ? panTilt.dy : 0.0;

    let panInput = ioc.inputs["pan"];
    let tiltInput = ioc.inputs["tilt"];

    //send update only if changed
    let update: {k: string, v: any}[] = [];
    if(panInput && "Float" in panInput && panInput.Float.value != new_pan && new_pan != lastPan) {
      update.push({k: "pan", v: -new_pan }); 
      setLastPan(new_pan);
    }
    if(tiltInput && "Float" in tiltInput && tiltInput.Float.value != new_tilt && new_tilt != lastTilt) {
      update.push({ k: "tilt", v: -new_tilt });
      setLastTilt(new_tilt);
    }
   
    setter(update);
  }, [ioc, setter, lastPan, lastTilt]);

  const driveSteerCallback = useCallback( (driveSteer: TouchPadState | null) => {
    let new_steer = driveSteer ? driveSteer.dx : 0.0;
    let new_drive = driveSteer ? driveSteer.dy : 0.0;

    let steerInput = ioc.inputs["steer"];
    let driveInput = ioc.inputs["drive"];

    //send update only if changed
    let update: {k: string, v: any}[] = [];
    if(steerInput && "Float" in steerInput && steerInput.Float.value != new_steer && new_steer != lastSteer) {
      update.push({k: "steer", v: new_steer }); 
      setLastSteer(new_steer);
    }
    if(driveInput && "Float" in driveInput && driveInput.Float.value != new_drive && new_drive != lastDrive) {
      update.push({ k: "drive", v: new_drive });
      setLastDrive(new_drive);
    }
   
    setter(update);

  }, [ioc, setter, lastDrive, lastSteer]);

  const headlights_input: IocFloatInput | null = ioc.inputs["headlights"] && "Float" in ioc.inputs["headlights"] ? ioc.inputs["headlights"].Float : null;

  const headlights_callback = useCallback( (value: number) => { 
    if(headlights_input && headlights_input.value != value) {
      setter([{
        k: "headlights",
        v: value
      }]);
    }

  }, [headlights_input, setter])

  const taillights_input: IocFloatInput | null = ioc.inputs["taillights"] && "Float" in ioc.inputs["taillights"] ? ioc.inputs["taillights"].Float : null;

  const taillights_callback = useCallback( (value: number) => {
    if(taillights_input && taillights_input.value != value) {
      setter([{
        k: "taillights",
        v: value
      }]);
    }
  }, [taillights_input, setter])

  const pan_trim_input: IocFloatInput | null = ioc.inputs["pan_trim"] && "Float" in ioc.inputs["pan_trim"] ? ioc.inputs["pan_trim"].Float : null;

  const pan_trim_callback = useCallback( (value: number) => {
    if(pan_trim_input && pan_trim_input.value != value) {
      setter([{
        k: "pan_trim",
        v: value
      }]);
    }
  }, [pan_trim_input, setter]);

  const tilt_trim_input: IocFloatInput | null = ioc.inputs["tilt_trim"] && "Float" in ioc.inputs["tilt_trim"] ? ioc.inputs["tilt_trim"].Float : null;

  const tilt_trim_callback = useCallback( (value: number) => {
    if(tilt_trim_input && tilt_trim_input.value != value) {
      setter([{
        k: "tilt_trim",
        v: value
      }]);
    }
  }, [tilt_trim_input, setter]);

  const cam_enable_input: IocBoolInput | null = ioc.inputs["enable_camera"] && "Bool" in ioc.inputs["enable_camera"] ? ioc.inputs["enable_camera"].Bool : null;
  
  const cam_enable_callback = useCallback( (value: boolean) => {
    if(cam_enable_input && cam_enable_input.value != value) {
      setter([{
        k: "enable_camera",
        v: value
      }]);
    }
  }, [cam_enable_input, setter]);

  const accel_x: IocFloatOutput | null = ioc.outputs["accel_x"] && "Float" in ioc.outputs["accel_x"] ? ioc.outputs["accel_x"].Float : null;
  const accel_y: IocFloatOutput | null = ioc.outputs["accel_y"] && "Float" in ioc.outputs["accel_y"] ? ioc.outputs["accel_y"].Float : null;
  const accel_z: IocFloatOutput | null = ioc.outputs["accel_z"] && "Float" in ioc.outputs["accel_z"] ? ioc.outputs["accel_z"].Float : null;
  
  const mag_x: IocFloatOutput | null = ioc.outputs["mag_x"] && "Float" in ioc.outputs["mag_x"] ? ioc.outputs["mag_x"].Float : null;
  const mag_y: IocFloatOutput | null = ioc.outputs["mag_y"] && "Float" in ioc.outputs["mag_y"] ? ioc.outputs["mag_y"].Float : null;
  const mag_z: IocFloatOutput | null = ioc.outputs["mag_z"] && "Float" in ioc.outputs["mag_z"] ? ioc.outputs["mag_z"].Float : null;
  
  return (
    <>
    <h3>littlefoot</h3>

    <div className="controls">
      <Table title="Accelerometer (1g)" rows={[{name:"x", value: accel_x},{name:"y", value: accel_y},{name:"z", value: accel_z}]} />
      <Table title="Magnetometer (mGauss)" rows={[{name:"x", value: mag_x},{name:"y", value: mag_y},{name:"z", value: mag_z}]} />
    </div>

    {/* <div className="video"> */}
      <img src={streamImageUrl} className="stream" />
    {/* </div> */}
    <div className="touchpads">
      <TouchPad label="🛞" bg="white" callback={driveSteerCallback}/>
      <TouchPad label="🧿" bg="white" callback={panTiltCallback}/>
    </div>
    <div className="controls">
      { 
        headlights_input ? 
        <Slider label = "Headlights" input = {headlights_input} callback={headlights_callback} /> : 
        <></>
      }
      <br/><br/>
      {
        taillights_input ? 
        <Slider label = "Taillights" input = {taillights_input} callback={taillights_callback} /> :
        <></>
      }
      <br/><br/>
      {
        cam_enable_input ? 
        <Checkbox label = "Enable Camera" input = {cam_enable_input} callback={cam_enable_callback} /> :
        <></>
      }
      <br/><br/>
      <div hidden={true}>
        { 
          pan_trim_input ? 
          <Slider label = "Pan - trim" input = {pan_trim_input} callback={pan_trim_callback} /> : 
          <></>
        }
        <br/><br/>
        {
          tilt_trim_input ? 
          <Slider label = "Tilt - trim" input = {tilt_trim_input} callback={tilt_trim_callback} /> :
          <></>
        }   
      </div>


 
    </div>
   
    </>
  )
}
