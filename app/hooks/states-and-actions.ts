import {FloodWarning} from "@/app/services/flood-api-interfaces";
import {LayoutSpecification, PaintSpecification} from "mapbox-gl";
import {Feature, FeatureCollection} from "geojson";
import {LayerType, MarkerType, SourceType} from "@/app/ui/map-interfaces";

export interface SelectedFloodWarningState {
    selectedWarning: FloodWarning | undefined;
}

export interface SelectedFloodWarningAction {
    type: string,
    payload: {
        newWarning: (FloodWarning | undefined);
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
            paint?: PaintSpecification,
            layout?: LayoutSpecification,
            filter?: Array<string>,
            severityLevel?: number
        } | undefined
        source?: {
            id: string,
            data: FeatureCollection | Feature
        }
    }
}