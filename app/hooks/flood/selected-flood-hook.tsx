'use client'
import {createContext, PropsWithChildren, useReducer} from "react";
import {FloodWarning} from "@/app/services/flood-api-interfaces";
import {
    useFloodWarningDispatchContext,
    useFloodWarningStateContext
} from "@/app/hooks/context-wrapper/context-wrapper";
import {SelectedFloodWarningAction, SelectedFloodWarningState} from "@/app/hooks/states-and-actions";

const defaultState: SelectedFloodWarningState = {
    selectedWarning: undefined
}

const selectedFloodWarningStateContext = createContext(defaultState);
const selectedFloodWarningDispatchContext = createContext(
    (action: SelectedFloodWarningAction) => {
        action.type = "DEFAULT_ACTION";
    });


export const SelectedFloodProvider = ({children}: PropsWithChildren) => {
    const [state, dispatch] = useReducer(SelectedFloodReducer, {selectedWarning: undefined});
    return(
        <selectedFloodWarningStateContext.Provider value={state}>
            <selectedFloodWarningDispatchContext.Provider value={dispatch}>
                {children}
            </selectedFloodWarningDispatchContext.Provider>
        </selectedFloodWarningStateContext.Provider>
    )
}

export const SelectedFloodReducer = (
    state:{selectedWarning: (FloodWarning | undefined)},
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
    return state;
}

export const useSelectedFloodWarningStateContext = () => {
    return useFloodWarningStateContext(selectedFloodWarningStateContext);
}

export const useSelectedFloodWarningDispatchContext = () => {
    return useFloodWarningDispatchContext(selectedFloodWarningDispatchContext);
}