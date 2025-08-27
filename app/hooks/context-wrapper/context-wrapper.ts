import {Context, useContext} from "react";
import {
    MapAction,
    MapState,
    SelectedFloodWarningAction,
    SelectedFloodWarningState, SelectedMonitoringStationAction, SelectedMonitoringStationState
} from "@/app/hooks/states-and-actions";

export const useMapStateContext = (contextToUse: Context<MapState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useMapDispatchContext = (contextToUse: Context<(action: MapAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useFloodWarningStateContext = (contextToUse: Context<SelectedFloodWarningState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useFloodWarningDispatchContext = (contextToUse: Context<(action: SelectedFloodWarningAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useMonitoringStationStateContext = (contextToUse: Context<SelectedMonitoringStationState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useMonitoringStationDispatchContext = (contextToUse: Context<(action: SelectedMonitoringStationAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}