'use server';

import {LayerProps} from "react-map-gl/mapbox";
import {GeoJSON} from "geojson";

export interface MarkerType {
    warning?: any,
    long: number,
    lat: number,
    severityLevel: number
}

export interface LayerType {
    id: string,
    type: string,
    source: string,
    paint: object,
    layout: object,
    severityLevel: number
}

export interface SourceType {
    id: string,
    data: string | GeoJSON | undefined
}