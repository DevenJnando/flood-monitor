import {Context, useContext} from "react";
import {
    MapAction,
    MapState,
    SelectedFloodWarningAction,
    SelectedFloodWarningState
} from "@/app/hooks/states-and-actions";

export const useMapStateContextWrapper = (contextToUse: Context<MapState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("State context may have been requested outside of Provider.");
    }
    return context;
}

export const useMapDispatchContextWrapper = (contextToUse: Context<(action: MapAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}

export const useSelectedFloodWarningStateContextWrapper = (contextToUse: Context<SelectedFloodWarningState>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("State context may have been requested outside of Provider.");
    }
    return context;
}

export const useSelectedFloodWarningDispatchContextWrapper = (
    contextToUse: Context<(action: SelectedFloodWarningAction) => void>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Dispatch context may have been requested outside of Provider.");
    }
    return context;
}