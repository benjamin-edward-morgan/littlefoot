import React, { useEffect, useRef, useState } from 'react';

interface TouchData {
    id: number;
    startX: number;
    startY: number;
}

class TouchHandler {

    callbackfn: (newState: TouchPadState | null) => void;
    elem: HTMLDivElement;
    label: string;
    touch: TouchData | null = null; 

    constructor(elem: HTMLDivElement, label: string, callbackfn: (newState: TouchPadState | null) => void) {
        this.elem = elem;
        this.callbackfn = callbackfn;
        this.label = label;

        elem.ontouchstart = this.touchStart;
        elem.ontouchend = this.touchEnd;
        elem.ontouchmove = this.touchMove;
        elem.ontouchcancel = this.touchCancel;
    }

    touchStart = (evt: TouchEvent) => {
        evt.preventDefault();
        if(!this.touch && evt.targetTouches && evt.targetTouches[0]) {
            let newTouch = evt.targetTouches[0];
            this.touch = {
                id: newTouch.identifier,
                startX: newTouch.clientX,
                startY: newTouch.clientY,
            }
            this.callbackfn({dx: 0, dy: 0});
        }
    }

    touchMove = (evt: TouchEvent) => {
        evt.preventDefault();
        if(this.touch && evt.targetTouches && evt.targetTouches[0]) {
            let newTouch = evt.targetTouches[0];
            let dx = newTouch.clientX - this.touch.startX;
            let dy = this.touch.startY - newTouch.clientY; //flips the sign of y axis
            this.callbackfn({dx: Math.max(Math.min(dx/75, 1.0), -1.0), dy: Math.max(Math.min(dy/75, 1.0), -1.0)});
        }
    }

    touchEnd = (evt: TouchEvent) => {
        evt.preventDefault();
        if(this.touch && evt.changedTouches && evt.changedTouches[0]) {
            this.touch = null;
            this.callbackfn(null);
        }
    }

    touchCancel = (evt: TouchEvent) => {
        evt.preventDefault();
        if(this.touch && evt.changedTouches && evt.changedTouches[0]) {
            this.touch = null;
            this.callbackfn(null);
        }
    }

}

interface TouchPadProps {
    label: string,
    callback: (move: TouchPadState | null) => void
}

export interface TouchPadState {
    dx: number;
    dy: number;
}

export default function TouchPad(props: TouchPadProps) {

    const touchpad: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    const [state, setState] = useState<TouchPadState | null>(null);
    const [handler, setHandler] = useState<TouchHandler | null>(null);

    useEffect(() => {
        if(touchpad.current && handler === null) {
            setHandler(new TouchHandler(touchpad.current, props.label, setState))
        }
    }, [handler, touchpad.current, props.label]);

    useEffect(() => {
        props.callback(state);
    }, [state, props.callback]);

    let interior = state ? <p>
            x: {state.dx}<br/>
            y: {state.dy}
        </p>
     : 
        <>
        </>
    
    return <>
        <div className="touchpad" >
            {interior}
            <div className="touchpadlabelcontainer">
                <div className="touchpadlabel" ref={touchpad}>
                    {props.label}
                </div>
            </div>
            
        </div>
    </>
}