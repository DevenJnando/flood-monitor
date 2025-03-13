'use client'
import {useContext, useReducer, createContext} from "react";
import {bool} from "sharp";

const mapStateContext = createContext({markers: [{long: 0, lat: 0, severityLevel: 0}]});
const mapDispatchContext = createContext((action: any) => {});


export const MapProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(MapReducer, {markers: []});
    return (
        // @ts-ignore
        <mapStateContext.Provider value={state}>
            <mapDispatchContext.Provider value={dispatch}>
                {children}
            </mapDispatchContext.Provider>
        </mapStateContext.Provider>
    )
}

export const MapReducer = (
    state:
    { markers: ({} | undefined)[] },
    action:
    { type: string, payload:
            { marker?:
                {
                    long: number,
                    lat: number,
                    severityLevel: number
                }
                | undefined
    }
    }) => {
    switch (action.type) {
        case "ADD_MARKER":
            return {
                ...state,
                markers: [...state.markers, action.payload.marker]
            }
        default:
    }
    return state;
}

export const useStateContext = () => {
    const stateContext = useContext(mapStateContext);
    if(!stateContext) {
        throw new Error("Context may have been requested outside of MapProvider.");
    }
    return stateContext;
}

export const useDispatchContext = () => {
    const dispatchContext = useContext(mapDispatchContext);
    if(!dispatchContext) {
        throw new Error("Context may have been requested outside of MapProvider.");
    }
    return dispatchContext;
}