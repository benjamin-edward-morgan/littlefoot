import TouchPad, { TouchPadState } from "./controls/TouchPad";
import Slider from "./controls/Slider";
import useIocWebsocketClient, { IocFloatInput } from './ioc/IocWebsocketClient';
import { useCallback, useState } from "react";


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


  const panTiltCallback = useCallback( (panTilt: TouchPadState | null) => {
    let new_pan = panTilt ? panTilt.dx : 0.0;
    let new_tilt = panTilt ? panTilt.dy : 0.0;

    let panInput = ioc.inputs["pan"];
    let tiltInput = ioc.inputs["tilt"];

    //send update only if changed
    let update: {k: string, v: any}[] = [];
    if(panInput && "Float" in panInput && panInput.Float.value != new_pan && new_pan != lastPan) {
      update.push({k: "pan", v: new_pan }); 
      setLastPan(new_pan);
    }
    if(tiltInput && "Float" in tiltInput && tiltInput.Float.value != new_tilt && new_tilt != lastTilt) {
      update.push({ k: "tilt", v: new_tilt });
      setLastTilt(new_tilt);
    }
   
    setter(update);
  }, [ioc, setter, lastPan, lastTilt]);

  const driveSteerCallback = useCallback( (driveSteer: TouchPadState | null) => {
    let new_lr = driveSteer ? driveSteer.dx : 0.0;
    let new_fr = driveSteer ? driveSteer.dy : 0.0;

    let lrInput = ioc.inputs["lr"];
    let frInput = ioc.inputs["fr"];

    //send update only if changed
    let update: {k: string, v: any}[] = [];
    if(lrInput && "Float" in lrInput && lrInput.Float.value != new_lr) {
      update.push({k: "lr", v: new_lr }); 
    }
    if(frInput && "Float" in frInput && frInput.Float.value != new_fr) {
      update.push({ k: "fr", v: new_fr });
    }
   
    setter(update);

  }, [ioc, setter]);

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


  return (
    <>
    <h3>littlefoot</h3>

    <div className="video">
      <img src={streamImageUrl} className="stream" />
    </div>
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
      {
        taillights_input ? 
        <Slider label = "Taillights" input = {taillights_input} callback={taillights_callback} /> :
        <></>
      }
      
    </div>
   
    </>
  )
}
