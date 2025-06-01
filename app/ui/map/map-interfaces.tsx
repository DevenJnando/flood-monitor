'use server';
import {GeoJSON} from "geojson";
import {LayoutSpecification, PaintSpecification} from "mapbox-gl";
import {FloodWarning} from "@/app/services/flood-api-interfaces";

export interface SignedPaintSpecification extends PaintSpecification {
    discriminator: "PaintSpecification";
}

export interface SignedLayoutSpecification extends LayoutSpecification {
    discriminator: "LayoutSpecification";
}

export interface FloodFilters {
    filterSevereWarning: boolean,
    filterFloodWarning: boolean,
    filterFloodAlert: boolean,
    filterNoLongerInForce: boolean
}

export interface StationFilters {
    filterRivers: boolean,
    filterRainfall: boolean,
    filterTidal: boolean,
    filterGroundwater: boolean
}

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
    paint?: SignedPaintSpecification,
    layout?: SignedLayoutSpecification,
    filter?: Array<string>,
    severityLevel?: number
}

export interface SourceType {
    id: string,
    data: string | GeoJSON | undefined
}