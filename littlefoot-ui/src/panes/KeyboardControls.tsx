import { useCallback, useEffect, useState } from "react";
import { IocState, SetterFn } from "../ioc/IocWebsocketClient";
import Section from "../layout/Section";



export default function KeyboardControls(props: { ioc: IocState, setter: SetterFn }) {

    const [drive_fwd, set_drive_fwd] = useState(false);
    const [drive_rev, set_drive_rev] = useState(false);
    const [drive_left, set_drive_left] = useState(false);
    const [drive_right, set_drive_right] = useState(false);

    const [tilt_up, set_tilt_up] = useState(false);
    const [tilt_down, set_tilt_down] = useState(false);
    const [pan_left, set_pan_left] = useState(false);
    const [pan_right, set_pan_right] = useState(false);

    let keymap: {[key: string]: (down: boolean) => void} = {
        "w": down => set_drive_fwd(down),
        "s": down => set_drive_rev(down),
        "a": down => set_drive_left(down),
        "d": down => set_drive_right(down),
        "arrowup": down => set_tilt_up(down),
        "arrowdown": down => set_tilt_down(down),
        "arrowleft": down => set_pan_left(down),
        "arrowright": down => set_pan_right(down),
    };

    const keydownCallback = useCallback((e: KeyboardEvent) => {
        let key = e.key.toLowerCase();
        if (keymap.hasOwnProperty(key)) {
            keymap[key](true);
            e.preventDefault();
        } else {
            console.log("unhandled key", e);
        }
    }, []);

    const keyupCallback = useCallback((e: KeyboardEvent) => {
        let key = e.key.toLowerCase();
        if (keymap.hasOwnProperty(key)) {
            keymap[key](false);
            e.preventDefault();
        }
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", keydownCallback);
        window.addEventListener("keyup", keyupCallback);

        return () => {
            window.removeEventListener("keydown", keydownCallback);
            window.removeEventListener("keyup", keyupCallback);
        }
    }, [keydownCallback, keyupCallback]);

    const [lastSteer, setLastSteer] = useState(0.0);
    const [lastDrive, setLastDrive] = useState(0.0);
  
    useEffect(() => {
        let drive = 0.0;
        if(drive_fwd) drive += 1.0;
        if(drive_rev) drive -= 1.0;

        let steer = 0.0;
        if(drive_left) steer += 1.0;
        if(drive_right) steer -= 1.0;

        let steerInput = props.ioc.inputs["steer"];
        let driveInput = props.ioc.inputs["drive"];    

        let update: {k: string, v: any}[] = [];
        if(steerInput && "Float" in steerInput && steerInput.Float.value != steer && steer != lastSteer) {
            update.push({k: "steer", v: steer }); 
            setLastSteer(steer);
        }
        if(driveInput && "Float" in driveInput && driveInput.Float.value != drive && drive != lastDrive) {
            update.push({ k: "drive", v: drive });
            setLastDrive(drive);
        }

        props.setter(update);
        
    }, [drive_fwd, drive_rev, drive_left, drive_right, tilt_up, tilt_down, pan_left, pan_right, props.ioc, props.setter, lastSteer, lastDrive])

    return <Section title={"🕹️ Drive/Look"}>
        <div className="row">
            <div className={drive_fwd ? "key down" : "key"}>
                W
            </div>
            <div className={drive_left ? "key down" : "key"}>
                A
            </div>
            <div className={drive_rev ? "key down" : "key"}>
                S
            </div>
            <div className={drive_right ? "key down" : "key"}>
                D
            </div>
        </div>
        <div className="row">
            <div className={tilt_up ? "key down" : "key"}>
                ↑
            </div>
            <div className={pan_left ? "key down" : "key"}>
                ←
            </div>
            <div className={tilt_down ? "key down" : "key"}>
                ↓
            </div>
            <div className={pan_right ? "key down" : "key"}>
                →
            </div>
        </div>
       
    </Section>

}