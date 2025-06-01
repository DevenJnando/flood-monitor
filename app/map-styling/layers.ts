import {ExpressionSpecification} from "mapbox-gl";
import {MapRef} from "react-map-gl/mapbox";
import {MeasureType} from "@/app/map-styling/layer-enums";
import {SignedLayoutSpecification, SignedPaintSpecification} from "@/app/ui/map/map-interfaces";

export function floodLayersAreVisible(mapRef: MapRef | null, isVisible: boolean, floodIds: Array<string>) {
    if(isVisible) {
        if(mapRef){
            floodIds.forEach(floodId => {
                mapRef.getMap().setLayoutProperty(floodId, 'visibility', 'visible');
            });
        }
    } else{
        if(mapRef){
            floodIds.forEach(floodId => {
                mapRef.getMap().setLayoutProperty(floodId, 'visibility', 'none');
            });
        }
    }
}

export function setLayerFilter(mapRef: MapRef | null, layerId: string, propertyId: string) {
    if(mapRef){
        mapRef.getMap().setFilter(layerId, [
            "in",
            "id",
            propertyId
        ]);
    }
}

export function monitoringStationLayerIdIsVisible(mapRef: MapRef | null, monitoringStationId: string, isVisible: boolean) {
    if(isVisible) {
        if(mapRef){
            mapRef.getMap().setLayoutProperty(monitoringStationId, 'visibility', 'visible');
        }
    } else {
        if(mapRef){
            mapRef.getMap().setLayoutProperty(monitoringStationId, 'visibility', 'none');
        }
    }
}

export function monitoringStationLayersAreVisible(mapRef: MapRef | null, isVisible: boolean, monitoringStationIds: Array<string>) {
    if(isVisible) {
        if(mapRef){
            monitoringStationIds.forEach(monitoringStationId => {
                mapRef.getMap().setLayoutProperty(monitoringStationId, 'visibility', 'visible');
            });
        }
    } else{
        if(mapRef){
            monitoringStationIds.forEach(monitoringStationId => {
                mapRef.getMap().setLayoutProperty(monitoringStationId, 'visibility', 'none');
            });
        }
    }
}

export function generateFloodPlaneLayer(type: string, severityLevel: number): SignedPaintSpecification {
    let color: string = '#000000';
    let modifier: number = 0;
    switch(type){
        case "line":
            color = '#000000';
            modifier = 1.5;
            break;
        case "fill":
            modifier = 0.5;
            color = layerColorBySeverity(severityLevel);
            break;
    }
    const floodPlaneLayer: SignedPaintSpecification | SignedLayoutSpecification = generateLayer(type, modifier, color);
    if(floodPlaneLayer.discriminator == "PaintSpecification"){
        return floodPlaneLayer;
    } else {
        console.error("Incorrect style specification returned. Expected PaintSpecification, but received LayoutSpecification.");
        return {discriminator: "PaintSpecification"};
    }
}

export function generateStationLayer(stationType: string, type: string): SignedLayoutSpecification {
    const modifier = type === "symbol" ? 0.25 : undefined;
    if (stationType === MeasureType.DOWNSTEAM_STAGE) {
        stationType = MeasureType.UPSTREAM_STAGE;
    }
    const stationLayer: SignedPaintSpecification | SignedLayoutSpecification = generateLayer(type, modifier, undefined, stationType);
    if(stationLayer.discriminator == "LayoutSpecification") {
        stationLayer.visibility = "none";
        return stationLayer;
    } else {
        console.error("Incorrect style specification returned. Expected LayoutSpecification, but received PaintSpecification.");
        return {discriminator: "LayoutSpecification"};
    }
}

function iconSizeOnZoom(): ExpressionSpecification {
    return [
        "interpolate",
        ["exponential", 1.5],
        ["zoom"],
        5,
        0.33,
        18,
        3
    ];
}

function generateLayer(type: string, modifier?: number, color?: string, image?: string): (SignedPaintSpecification | SignedLayoutSpecification) {
    const paintSpec: SignedPaintSpecification = {discriminator:"PaintSpecification"};
    const layoutSpec: SignedLayoutSpecification = {discriminator:"LayoutSpecification"};
    switch (type) {
        case "line":
            paintSpec["line-color"] = color;
            paintSpec["line-width"] = modifier;
            return paintSpec;
        case "fill":
            paintSpec["fill-color"] = color;
            paintSpec["fill-opacity"] = modifier;
            return paintSpec;
        case "symbol":
            layoutSpec["icon-image"] = image;
            layoutSpec["icon-size"] = modifier;
            layoutSpec["icon-allow-overlap"] = true;
            layoutSpec["icon-size"] = iconSizeOnZoom();
            layoutSpec.visibility = "visible";
            return layoutSpec;
        default:
            return {discriminator:"PaintSpecification"}
    }
}

function layerColorBySeverity(severityLevel: number): string {
    let color = '#000000';
    switch (severityLevel) {
        case 1:
            color = '#720101';
            break;
        case 2:
            color = '#f80a0a';
            break;
        case 3:
            color = '#f5c60a';
            break;
        case 4:
            color = '#0868d5';
            break;
    }
    return color;
}