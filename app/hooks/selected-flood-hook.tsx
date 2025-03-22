'use client'
import {createContext, useReducer} from "react";
import {FloodWarning} from "@/app/services/flood-api-interfaces";
import {useContextWrapper} from "@/app/hooks/context-wrapper";


const selectedFloodWarningStateContext = createContext({selectedWarning: undefined});
const selectedFloodWarningDispatchContext = createContext((action: any) => {});


export const SelectedFloodProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(SelectedFloodReducer, {selectedWarning: undefined});
    return(
        // @ts-ignore
        <selectedFloodWarningStateContext.Provider value={state}>
            <selectedFloodWarningDispatchContext.Provider value={dispatch}>
                {children}
            </selectedFloodWarningDispatchContext.Provider>
        </selectedFloodWarningStateContext.Provider>
    )
}

export const SelectedFloodReducer = (
    state:{selectedWarning: (FloodWarning | undefined)} | undefined,
    action:{type: string, payload:{
            newWarning: (FloodWarning | undefined);
        }}) => {
    switch(action.type) {
        case "SELECT_WARNING":
            return {
                selectedWarning: action.payload.newWarning
            }
        case "COLLAPSE_WARNING":
            return {
                selectedWarning: undefined
            }
    }
}

export const useSelectedFloodWarningStateContext = () => {
    return useContextWrapper(selectedFloodWarningStateContext);
}

export const useSelectedFloodWarningDispatchContext = () => {
    return useContextWrapper(selectedFloodWarningDispatchContext);
}