import { useEffect, useReducer } from 'react';
import useWebSocketWithReconnect, { ReadyState } from 'react-use-websocket';

export interface IocFloatInput {
    value: number;
    min: number;
    max: number;
    step: number;
}

export interface IocBoolInput {
    value: boolean;
}

export interface IocStringInput {
    value: string;
    max_length: number;
    choices: { [key: string]: string } | undefined;
}

export type IocInput = { Float: IocFloatInput } | { Bool: IocBoolInput } | { String: IocStringInput} ;

export interface IocBoolOutput {
    value: boolean;
}

export interface IocFloatOutput {
    value: number;
}

export interface IocStringOutput {
    value: string;
}

export interface IocArrayOutput {
    value: any[];
}

export type IocOutput = {Float: IocFloatOutput } | { Bool: IocBoolOutput } | { String: IocStringOutput } | { Array: IocArrayOutput };

export interface IocState {
    connected: boolean;
    status: string;
    upSince: Date | null,
    time: { seconds: number } | null;
    inputs: { [key: string]: IocInput };
    outputs: { [key: string]: IocOutput };
}

export type SetterFn = (arr: { k: string, v: number | boolean | string }[]) => void;

interface InternalState {
    time: { seconds: number } | null;
    inputs: { [key: string]: IocInput };
    outputs: { [key: string]: IocOutput };
}

const InitialInternalState: InternalState = {
    time: null,
    inputs: {},
    outputs: {}
}

function assignInput(current: IocInput | undefined, update: IocInput): IocInput {
    if(current) {
        let new_input = Object.apply({}, [current]);
        if("Float" in current && "Float" in update) {
            new_input.Float.value = update.Float.value;
        } else if("Bool" in current && "Bool" in update) {
            new_input.Bool.value = update.Bool.value;
        } else if("String" in current && "String" in update) {
            new_input.String.value = update.String.value;
        }
        return new_input;
    } else {
        return update;
    }
}

function assignOutput(current: IocOutput | undefined, update: IocOutput): IocOutput {
    if(current) {
        let new_output = Object.apply({}, [current]);
        if("Float" in current && "Float" in update) {
            new_output.Float.value = update.Float.value;
        } else if("Bool" in current && "Bool" in update) {
            new_output.Bool.value = update.Bool.value;
        } else if("String" in current && "String" in update) {
            new_output.String.value = update.String.value;
        } else if ("Array" in current && "Array" in update) {
            new_output.Array.value = update.Array.value;
        }
        return new_output;
    } else {
        return update;
    }
}

interface WsMessage {
    time: { seconds: number };
    inputs: { [key: string]: IocInput };
    outputs: { [key: string]: IocOutput };
}



export default function useIocWebsocketClient(url: string): [IocState, SetterFn] {

    const wsProps = {
        shouldReconnect: (ce: CloseEvent) => !ce.wasClean,
        reconnectAttempts: 1000,
        reconnectInterval: 100,
        share: true
    };

    const { sendMessage, lastMessage, readyState } = useWebSocketWithReconnect(url, wsProps);

    const [upSince, setUpSince] = useReducer( (state: Date | null, message: ReadyState) => { 
        if(state === null && message === ReadyState.OPEN) {
            state = new Date();
        } else if(message !== ReadyState.OPEN) {
            state = null;
        }
        return state;
    }, null);
    
    const status = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
      }[readyState];

    useEffect(() => {
    setUpSince(readyState);
    }, [readyState]);

    const connected = readyState === ReadyState.OPEN;

    function stateReducer(state: InternalState, update: WsMessage): InternalState {
        let new_inputs: { [key: string]: IocInput } = JSON.parse(JSON.stringify(state.inputs));
        let new_outputs: { [key: string]: IocOutput } = JSON.parse(JSON.stringify(state.outputs));

        for(const k in update.inputs) {
            new_inputs[k] = assignInput(new_inputs[k], update.inputs[k]);
        }
        for(const k in update.outputs) {
            new_outputs[k] = assignOutput(new_outputs[k], update.outputs[k]);
        }

        return {
            time: update.time,
            inputs: new_inputs,
            outputs: new_outputs,
        }
    }

    const [state, setState] = useReducer(stateReducer, InitialInternalState);

    const setter = (arr: {k: string, v: any }[]) => {
        var update: object = { };
        
        for(const kv of arr) {
            let k = kv.k;
            let v = kv.v;

            let input = state.inputs[k];
            if (input) {
                //todo: constrain
                let keyUpdate: { [key: string]: any } = {};
                if("Float" in input && typeof v === "number") {
                    keyUpdate[k] = { Float: { value: v } };  
                    update = Object.assign(update, keyUpdate); 
                } else if("Bool" in input && typeof v === "boolean") {
                    keyUpdate[k] = { Bool: { value: v } };
                    update = Object.assign(update, keyUpdate); 
                } else if("String" in input && typeof v === "string") {
                    keyUpdate[k] = { String: { value: v } };
                    update = Object.assign(update, keyUpdate); 
                } else {
                    console.warn("can't set input " + k + " to type " + (typeof v));
                }
            } else {
                console.warn("can't set nonexistant input " + k);
            }
        }

        if(Object.keys(update).length > 0) {
            sendMessage(JSON.stringify(update));
        }
    };

    useEffect(() => {
        if(lastMessage && lastMessage.data) {
            let data: WsMessage = JSON.parse(lastMessage?.data);
            if(data) {
                setState(data)
            }
        }
    }, [lastMessage, setState]);

    let iocState = {
        connected: connected,
        status: status,
        upSince: upSince,
        time: state.time,
        inputs: state.inputs,
        outputs: state.outputs,
    };

    return [iocState, setter];
}