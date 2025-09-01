import {FloodWarning, MonitoringStation} from "../services/flood-api-interfaces";
import {Feature, FeatureCollection} from "geojson";
import {
    LayerType,
    MarkerType,
    SignedLayoutSpecification,
    SignedPaintSpecification,
    SourceType
} from "../ui/map/map-interfaces";
import {ToastData} from "../ui/toast/toast-interface";

export interface SelectedFloodWarningState {
    selectedWarning: FloodWarning | undefined;
}

export interface SelectedFloodWarningAction {
    type: string,
    payload: {
        newWarning: (FloodWarning | undefined);
    }
}

export interface SelectedMonitoringStationState {
    selectedStation: MonitoringStation | undefined;
}

export interface SelectedMonitoringStationAction {
    type: string,
    payload: {
        newStation: (MonitoringStation | undefined);
    }
}

export interface toastState {
    toastData: ToastData | undefined;
}

export interface toastAction {
    type: string,
    payload: {
        toast: ToastData
    }
}

export interface MapState {
    markers: (MarkerType | undefined)[],
    layers: (LayerType | undefined)[],
    sources: (SourceType | undefined)[]
}

export interface MapAction {
    type: string,
    payload: {
        marker?: {
            warning?: FloodWarning,
            long: number,
            lat: number,
            severityLevel?: number
        } | undefined,
        layer?: {
            id: string,
            type: string,
            source: string,
            paint?: SignedPaintSpecification,
            layout?: SignedLayoutSpecification,
            filter?: Array<string>,
            severityLevel?: number
        } | undefined
        source?: {
            id: string,
            data: FeatureCollection | Feature
        } | undefined
        layerVisibility?: {
            id: string,
            visibility: boolean
        } | undefined
    }
}