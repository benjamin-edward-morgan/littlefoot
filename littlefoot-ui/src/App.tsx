import TouchPad, { TouchPadState } from "./touchpad/TouchPad";
import useIocWebsocketClient from './ioc/IocWebsocketClient';
import { useCallback } from "react";


export default function App() {

  const websocketUrl = "ws://" + window.location.host + "/ws";

  // const websocketUrl = "ws://localhost:8080/ws";

  const [ioc, setter] = useIocWebsocketClient(websocketUrl);

  const panTiltCallback = useCallback( (panTilt: TouchPadState | null) => {
    let new_pan = panTilt ? panTilt.dx : 0.0;
    let new_tilt = panTilt ? panTilt.dy : 0.0;

    let panInput = ioc.inputs["pan"];
    let tiltInput = ioc.inputs["tilt"];

    //send update only if changed
    let update: {k: string, v: any}[] = [];
    if(panInput && "Float" in panInput && panInput.Float.value != new_pan) {
      update.push({k: "pan", v: new_pan }); 
    }
    if(tiltInput && "Float" in tiltInput && tiltInput.Float.value != new_tilt) {
      update.push({ k: "tilt", v: new_tilt });
    }
   
    setter(update);
  }, []);

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

  }, [setter, ioc]);

  return (
    <>
    <h3>littlefoot</h3>

    <div className="video">
      video goes here...
    </div>
    <div className="touchpads">
      <TouchPad label="🛞" bg="white" callback={driveSteerCallback}/>
      <TouchPad label="🧿" bg="white" callback={panTiltCallback}/>
    </div>
   
    </>
  )
}
