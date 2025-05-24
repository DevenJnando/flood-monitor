'use server';
import {GeoJSON} from "geojson";
import {LayoutSpecification, PaintSpecification} from "mapbox-gl";
import {FloodWarning} from "@/app/services/flood-api-interfaces";

export interface MarkerType {
    warning?: FloodWarning,
    long: number,
    lat: number,
    severityLevel?: number
}

export interface LayerType {
    id: string,
    type: string,
    source: string,
    paint?: PaintSpecification,
    layout?: LayoutSpecification,
    filter?: Array<string>,
    severityLevel?: number
}

export interface SourceType {
    id: string,
    data: string | GeoJSON | undefined
}