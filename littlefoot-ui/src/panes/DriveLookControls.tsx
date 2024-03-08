import { useCallback, useState } from "react";
import TouchPad, { TouchPadState } from "../controls/TouchPad";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";


export default function DriveLookControls(props: { ioc: IocState, setter: SetterFn }) {


  const [lastPan, setLastPan] = useState(0.0);
  const [lastTilt, setLastTilt] = useState(0.0);
  const [lastSteer, setLastSteer] = useState(0.0);
  const [lastDrive, setLastDrive] = useState(0.0);


  const panTiltCallback = useCallback( (panTilt: TouchPadState | null) => {
    let new_pan = panTilt ? panTilt.dx : 0.0;
    let new_tilt = panTilt ? panTilt.dy : 0.0;

    let panInput = props.ioc.inputs["pan"];
    let tiltInput = props.ioc.inputs["tilt"];

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
   
    props.setter(update);
  }, [props.ioc, props.setter, lastPan, lastTilt]);

  const driveSteerCallback = useCallback( (driveSteer: TouchPadState | null) => {
    let new_steer = driveSteer ? driveSteer.dx : 0.0;
    let new_drive = driveSteer ? driveSteer.dy : 0.0;

    let steerInput = props.ioc.inputs["steer"];
    let driveInput = props.ioc.inputs["drive"];

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
   
    props.setter(update);

  }, [props.ioc, props.setter, lastDrive, lastSteer]);


    return <Section title={"🕹️ Drive/Look"}>
        <div className="touchpads">
            <TouchPad label="🛞" callback={driveSteerCallback}/>
            <TouchPad label="🧿" callback={panTiltCallback}/>
        </div>
    </Section>
}