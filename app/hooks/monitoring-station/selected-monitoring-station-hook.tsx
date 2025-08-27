'use client'
import {createContext, PropsWithChildren, useReducer} from "react";
import {MonitoringStation} from "@/app/services/flood-api-interfaces";
import {
    useMonitoringStationDispatchContext,
    useMonitoringStationStateContext
} from "@/app/hooks/context-wrapper/context-wrapper";
import {
    SelectedMonitoringStationAction,
    SelectedMonitoringStationState
} from "@/app/hooks/states-and-actions";

const defaultState: SelectedMonitoringStationState = {
    selectedStation: undefined
}

const selectedMonStnStateContext = createContext(defaultState);
const selectedMonStnDispatchContext = createContext(
    (action: SelectedMonitoringStationAction) => {
        action.type = "DEFAULT_ACTION";
    });

export const SelectedMonStnProvider = ({children}: PropsWithChildren) => {
    const [state, dispatch] = useReducer(SelectedMonStnReducer, {selectedStation: undefined});
    return(
        <selectedMonStnStateContext.Provider value={state}>
            <selectedMonStnDispatchContext.Provider value={dispatch}>
                {children}
            </selectedMonStnDispatchContext.Provider>
        </selectedMonStnStateContext.Provider>
    )
}

export const SelectedMonStnReducer = (
    state:{selectedStation: (MonitoringStation | undefined)},
    action:{type: string, payload:{
            newStation: (MonitoringStation | undefined);
        }}) => {
    switch(action.type) {
        case "SELECT_STATION":
            return {
                selectedStation: action.payload.newStation
            }
        case "COLLAPSE_STATION":
            return {
                selectedStation: undefined
            }
    }
    return state;
}

export const useSelectedMonStnStateContext = () => {
    return useMonitoringStationStateContext(selectedMonStnStateContext);
}

export const useSelectedMonStnDispatchContext = () => {
    return useMonitoringStationDispatchContext(selectedMonStnDispatchContext);
}