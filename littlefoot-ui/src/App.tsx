import TouchPad, { TouchPadState } from "./controls/TouchPad";
import Slider from "./controls/Slider";
import useIocWebsocketClient, { IocBoolInput, IocFloatInput, IocFloatOutput } from './ioc/IocWebsocketClient';
import { useCallback, useState } from "react";
import Checkbox from "./controls/Checkbox";
import Chart, { DefaultChartParams } from "./instruments/Chart";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useMeasure } from "@uidotdev/usehooks";
import ImuCharts from "./panes/ImuCharts";
import LightControls from "./panes/LightControls";
import CameraControls from "./panes/CameraControls";
import Settings from "./panes/Settings";


export default function App() {

  const websocketUrl = "ws://" + window.location.host + "/ws";
  const streamImageUrl = "http://" + window.location.host + "/stream";
  
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

  return (
    <>
    <Header title="lil' foot" />

    <div className="content">
      <div className="panela">
        <div className="panel1">
          <img src={streamImageUrl} className="stream" />
        </div>

        <div className="panel2">
          ctrl
        </div>

      </div>
      <div className="panelb">
        <ImuCharts ioc={ioc}/>
        <LightControls ioc={ioc} setter={setter}/>
        <CameraControls ioc={ioc} setter={setter}/>
        <Settings ioc={ioc} setter={setter}/>
      </div> 
    </div>
    <Footer></Footer>


      {/* <img src={streamImageUrl} className="stream" /> */}
    {/* <div className="touchpads">
      <TouchPad label="🛞" bg="white" callback={driveSteerCallback}/>
      <TouchPad label="🧿" bg="white" callback={panTiltCallback}/>
    </div> */}
  
   
    </>
  )
}
