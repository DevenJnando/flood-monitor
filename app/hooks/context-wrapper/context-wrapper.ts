import {Context, useContext} from "react";
import {
    MapAction,
    MapState,
    SelectedFloodWarningAction,
    SelectedFloodWarningState, SelectedMonitoringStationAction, SelectedMonitoringStationState
} from "@/app/hooks/states-and-actions";

export const mapStateCtxtWrapper = (contextToUse: Context<MapState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const mapDispCtxtWrapper = (contextToUse: Context<(action: MapAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const selFloodWarnStateCtxtWrapper = (contextToUse: Context<SelectedFloodWarningState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const selFloodWarnDispCtxtWrapper = (contextToUse: Context<(action: SelectedFloodWarningAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const selMonitoringStnStateCtxtWrapper = (contextToUse: Context<SelectedMonitoringStationState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const selMonitoringStnDispCtxtWrapper = (contextToUse: Context<(action: SelectedMonitoringStationAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}