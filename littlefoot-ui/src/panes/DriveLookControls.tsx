import { useCallback, useEffect, useReducer, useState } from "react";
import TouchPad, { TouchPadState } from "../controls/TouchPad";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";


export function TouchControls(props: { ioc: IocState, setter: SetterFn }) {
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


    return <div className="touchpads">
          <TouchPad label="🛞" callback={driveSteerCallback}/>
          <TouchPad label="🧿" callback={panTiltCallback}/>
      </div>
}



interface KeyboardControlState {
  driveFwdKeyDown: boolean;
  driveRevKeyDown: boolean;
  driveLeftKeyDown: boolean;
  driveRightKeyDown: boolean;
  tiltUpKeyDown: boolean;
  tiltDownKeyDown: boolean;
  panLeftKeyDown: boolean;
  panRightKeyDown: boolean;
  plusKeyDown: boolean;
  minusKeyDown: boolean;
  lBrackDown: boolean;
  rBrackDown: boolean;
  semiDown: boolean;
  aposDown: boolean;
  enterDown: boolean;
  drive: number;
  throttle: number;
  steer: number;
  steerRad: number;
  pan: number;
  tilt: number;
  ptStepSize: number;
}

const DefaultKeyboardControlState: KeyboardControlState = {
  driveFwdKeyDown: false,
  driveRevKeyDown: false,
  driveLeftKeyDown: false,
  driveRightKeyDown: false,
  tiltUpKeyDown: false,
  tiltDownKeyDown: false,
  panLeftKeyDown: false,
  panRightKeyDown: false,
  plusKeyDown: false,
  minusKeyDown: false,
  lBrackDown: false,
  rBrackDown: false,
  semiDown: false,
  aposDown: false,
  enterDown: false,
  drive: 0,
  throttle: 0.75,
  steer: 0,
  steerRad: 1.0,
  pan: 0,
  tilt: 0,
  ptStepSize : 0.05
}

function keyboardReducer(state: KeyboardControlState, evt: KeyboardEvent) {
  let isKeyDown = evt.type === "keydown";
  let key = evt.key;

  let speed = state.throttle;
  let turn = state.steerRad;
  let ptSpeed = state.ptStepSize;

  switch(key) {
      case "w":
          evt.preventDefault();
          return { ...state, driveFwdKeyDown: isKeyDown, drive: isKeyDown ? speed : 0 };
      case "s":
          evt.preventDefault();
          return { ...state, driveRevKeyDown: isKeyDown, drive: isKeyDown ? -speed : 0 };
      case "a":
          evt.preventDefault();
          return { ...state, driveLeftKeyDown: isKeyDown, steer: isKeyDown ? -turn : 0 };
      case "d":
          evt.preventDefault();
          return { ...state, driveRightKeyDown: isKeyDown, steer: isKeyDown ? turn : 0 };
      case "-" :
          evt.preventDefault();
          var newThrottle = Math.max(Math.min(state.throttle - (isKeyDown ? 0.1 : 0.0), 1.0), 0.1);
          return { ...state, minusKeyDown: isKeyDown, throttle: newThrottle };
      case "=" :
          evt.preventDefault();
          var newThrottle = Math.max(Math.min(state.throttle + (isKeyDown ? 0.1 : 0.0), 1.0), 0.1);
          return { ...state, plusKeyDown: isKeyDown, throttle: newThrottle };
      case "[" : 
          evt.preventDefault();
          var newSteerRad = Math.max(Math.min(state.steerRad - (isKeyDown ? 0.1 : 0.0), 1.0), -1.0);
          return { ...state, lBrackDown: isKeyDown, steerRad: newSteerRad };
      case "]" :
          evt.preventDefault();
          var newSteerRad = Math.max(Math.min(state.steerRad + (isKeyDown ? 0.1 : 0.0), 1.0), -1.0);
          return { ...state, rBrackDown: isKeyDown, steerRad: newSteerRad };
      case ";" :
          evt.preventDefault();
          var newPtStepSize = Math.max(Math.min(state.ptStepSize - (isKeyDown ? 0.01 : 0.0), 0.1), 0.01);
          return { ...state, semiDown: isKeyDown, ptStepSize: newPtStepSize };
      case "'" :
          evt.preventDefault();
          var newPtStepSize = Math.max(Math.min(state.ptStepSize + (isKeyDown ? 0.01 : 0.0), 0.1), 0.01);
          return { ...state, aposDown: isKeyDown, ptStepSize: newPtStepSize };
      case "Enter":
          evt.preventDefault();
          if(isKeyDown) {
            return { ...state, enterDown: isKeyDown, pan: 0, tilt: 0 };
          } else {
            return { ...state, enterDown: isKeyDown };
          }
      case "ArrowUp":
          evt.preventDefault();
          var newTilt = Math.max(Math.min(state.tilt + (isKeyDown ? -ptSpeed : 0), 1.0), -1.0);
          return { ...state, tiltUpKeyDown: isKeyDown, tilt: newTilt };
      case "ArrowDown":
          evt.preventDefault();
          var newTilt = Math.max(Math.min(state.tilt + (isKeyDown ? ptSpeed : 0), 1.0), -1.0);
          return { ...state, tiltDownKeyDown: isKeyDown, tilt: newTilt };
      case "ArrowLeft":
          evt.preventDefault();
          var newPan = Math.max(Math.min(state.pan + (isKeyDown ? ptSpeed : 0), 1.0), -1.0);
          return { ...state, panLeftKeyDown: isKeyDown, pan: newPan };
      case "ArrowRight":
          evt.preventDefault();
          var newPan = Math.max(Math.min(state.pan + (isKeyDown ? -ptSpeed : 0), 1.0), -1.0);
          return { ...state, panRightKeyDown: isKeyDown, pan: newPan };
      default:
          return state;
  }
}


export function KeyboardControls(props: { ioc: IocState, setter: SetterFn }) {

  const [state, keyboardHandler] = useReducer(keyboardReducer, DefaultKeyboardControlState);
  useEffect(() => {
      console.log("Adding keyboard event listeners");
      
      window.addEventListener("keydown",  keyboardHandler);
      window.addEventListener("keyup",  keyboardHandler);

      return () => {
          window.removeEventListener("keydown",  keyboardHandler);
          window.removeEventListener("keyup",  keyboardHandler);
      }
  }, [ keyboardHandler]);

  const driveInput = props.ioc.inputs["drive"];
  const steerInput = props.ioc.inputs["steer"];
  const panInput = props.ioc.inputs["pan"];
  const tiltInput = props.ioc.inputs["tilt"];

  const [lastDrive, setLastDrive] = useState(0.0);
  const [lastSteer, setLastSteer] = useState(0.0);
  const [lastPan, setLastPan] = useState(0.0);
  const [lastTilt, setLastTilt] = useState(0.0);
  
  useEffect(() => {
      let update: {k: string, v: any}[] = [];
      if(driveInput && "Float" in driveInput && driveInput.Float.value != state.drive && state.drive != lastDrive) {
          update.push({ k: "drive", v: state.drive });
          setLastDrive(state.drive);
      }
      if(steerInput && "Float" in steerInput && steerInput.Float.value != state.steer && state.steer != lastSteer) {
          update.push({ k: "steer", v: state.steer });
          setLastSteer(state.steer);
      }
      if(panInput && "Float" in panInput && panInput.Float.value != state.pan && state.pan != lastPan) {
          update.push({ k: "pan", v: state.pan });
          setLastPan(state.pan);
      }
      if(tiltInput && "Float" in tiltInput && tiltInput.Float.value != state.tilt && state.tilt != lastTilt) {
          update.push({ k: "tilt", v: state.tilt });
          setLastTilt(state.tilt);
      }

      if(update.length > 0) {
          props.setter(update);
      }
  }, [
      state, props.setter,
      lastDrive, lastSteer, lastPan, lastTilt,
      driveInput, steerInput, panInput, tiltInput
  ]);

  return <>
    <div className="row" style={{paddingTop:"1em"}}>
      <div className="key-col">
          <h5 style={{textAlign:"center", marginBottom:"0.5em"}}>Drive / Steer</h5>
          <div className="key-row">
              <div className={state.driveFwdKeyDown ? "key down" : "key"}>
                  W
              </div>
          </div>
          <div className="key-row">
              <div className={state.driveLeftKeyDown ? "key down" : "key"}>
                  A
              </div>
              <div className={state.driveRevKeyDown ? "key down" : "key"}>
                  S
              </div>
              <div className={state.driveRightKeyDown ? "key down" : "key"}>
                  D
              </div>
          </div>
          &nbsp;
          <div className="key-row">
              <div className={state.minusKeyDown ? "key down" : "key"}>
                  -
              </div>
              <div className={state.plusKeyDown ? "key down" : "key"}>
                  =
              </div>
              <div className="key-col">
                <h5 style={{textAlign:"center"}}>Throttle</h5>
                <progress value={state.throttle} max="1"></progress>
              </div>
          </div>
          <div className="key-row">
              <div className={state.lBrackDown ? "key down" : "key"}>
                  {"["}
              </div>
              <div className={state.rBrackDown ? "key down" : "key"}>
                  {"]"}
              </div>
              <div className="key-col">
                <h5 style={{textAlign:"center"}}>Steering</h5>
                <progress value={state.steerRad} max="1"></progress>
              </div>      
          </div>
      </div>
      <div className="key-col">
          <h5 style={{textAlign:"center", marginBottom:"0.5em"}}>Pan / Tilt</h5>
          <div className="key-row">
              <div className={state.tiltUpKeyDown ? "key down" : "key"}>
                  ↑
              </div>
          </div>
          <div className="key-row">
              <div className={state.panLeftKeyDown ? "key down" : "key"}>
                  ←
              </div>
              <div className={state.tiltDownKeyDown ? "key down" : "key"}>
                  ↓
              </div>
              <div className={state.panRightKeyDown ? "key down" : "key"}>
                  →
              </div>
          </div>
          &nbsp;
          <div className="key-row">
              <div className={state.semiDown ? "key down" : "key"}>
                  ;
              </div>
              <div className={state.aposDown ? "key down" : "key"}>
                  '
              </div>
              <div className="key-col">
                <h5 style={{textAlign:"center"}}>P/T Speed</h5>
                <progress value={state.ptStepSize} max="0.1"></progress>
              </div> 
          </div>
          <div className="key-row" style={{paddingTop:"1em"}}>
            <div className={state.enterDown ? "key down wide" : "key wide"}>
                Return
            </div>
            <div className="key-col">
              <h5 style={{textAlign:"center"}}>Reset camera</h5>
            </div>
          </div>
      </div>
    </div>
    
  </>

}


export default function DriveLookControls(props: { ioc: IocState, setter: SetterFn }) {

  const hasTouch = window.ontouchstart !== undefined;

  if(hasTouch) {
    return <Section title={"🕹️ Drive/Look"}>
      <TouchControls ioc={props.ioc} setter={props.setter} />
    </Section>;
  } else {
    return <Section title={"🕹️ Drive/Look"}>
      <KeyboardControls ioc={props.ioc} setter={props.setter} />
    </Section>
  }
  
}