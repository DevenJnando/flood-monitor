'use client'
import {useContext, useReducer, createContext, Context} from "react";
import {LayerProps} from "react-map-gl/mapbox";
import {Feature, FeatureCollection} from "geojson";
import {FloodWarning} from "@/app/services/flood-api-interfaces";

const mapStateContext = createContext({
    markers: [{long: 0, lat: 0, severityLevel: 0}],
    layers: [{id: '', type: '', source: '', paint: {}, severityLevel: 0}],
    sources: [{id: '', data: {}}]
});
const mapDispatchContext = createContext((action: any) => {});
const selectedFloodWarningStateContext = createContext({});
const selectedFloodWarningDispatchContext = createContext({});


export const MapProvider = ({children}: any) => {
    const [state, dispatch] = useReducer(MapReducer, {markers: [], layers: [], sources: []});
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
    {
        markers: ({} | undefined)[],
        layers: ({} | undefined)[],
        sources: ({} | undefined)[]
    },
    action:
    { type: string, payload:
            {
                marker?:
                    {
                        warning?: FloodWarning,
                        long: number,
                        lat: number,
                        severityLevel: number
                    }
                | undefined,
                layer?:
                    {
                        id: string,
                        type: LayerProps["type"],
                        source: string,
                        paint: {},
                        severityLevel: number
                    }
                    | undefined
                source?:
                    {
                        id: string,
                        data: FeatureCollection | Feature
                    }
            }
    }) => {
    switch (action.type) {
        case "ADD_MARKER":
            return {
                ...state,
                markers: [...state.markers, action.payload.marker]
            }
        case "ADD_LAYER":
            return {
                ...state,
                layers: [...state.layers, action.payload.layer]
            }
        case "ADD_SOURCE":
            return {
                ...state,
                sources: [...state.sources, action.payload.source]
            }
        default:
    }
    return state;
}

const useContextWrapper = (contextToUse: Context<any>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Context may have been requested outside of MapProvider.");
    }
    return context;
}

export const useStateContext = () => {
    return useContextWrapper(mapStateContext);
}

export const useDispatchContext = () => {
    return useContextWrapper(mapDispatchContext);
}

export const useSelectedFloodWarningStateContext = () => {
    return useContextWrapper(selectedFloodWarningStateContext);
}

export const useSelectedFloodWarningDispatchContext = () => {
    return useContextWrapper(selectedFloodWarningDispatchContext);
}