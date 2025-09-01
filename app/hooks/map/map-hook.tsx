'use client'
import {useReducer, createContext, PropsWithChildren} from "react";
import {useMapDispatchContext, useMapStateContext} from "../../hooks/context-wrapper/context-wrapper";
import {MapAction, MapState} from "../../hooks/states-and-actions";

const defaultState: MapState = {
    markers: [{long: 0, lat: 0, severityLevel: 0}],
    layers: [{id: '', type: '', source: '',
        paint: {
            discriminator:"PaintSpecification"
        },
        layout: {
            discriminator:"LayoutSpecification"
        }, severityLevel: 0}],
    sources: [{id: '', data: undefined}]
}
const mapStateContext = createContext(defaultState);

const mapDispatchContext = createContext((action: MapAction) => {
    action.type = "DEFAULT_ACTION";
});

export const MapProvider = ({children}: PropsWithChildren) => {
    const [state, dispatch] = useReducer(MapReducer, {markers: [], layers: [], sources: []});
    return (
        <mapStateContext.Provider value={state}>
            <mapDispatchContext.Provider value={dispatch}>
                {children}
            </mapDispatchContext.Provider>
        </mapStateContext.Provider>
    )
}

export const MapReducer = (
    state: MapState,
    action: MapAction) => {
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
        case "REMOVE_MARKERS":
            return {
                ...state,
                markers: []
            }
        default:
    }
    return state;
}


export const useStateContext = () => {
    return useMapStateContext(mapStateContext);
}

export const useDispatchContext = () => {
    return useMapDispatchContext(mapDispatchContext);
}