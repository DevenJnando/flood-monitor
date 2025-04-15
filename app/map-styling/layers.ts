import {ExpressionSpecification, LayoutSpecification, PaintSpecification} from "mapbox-gl";
import {MapRef} from "react-map-gl/mapbox";
import {MeasureType} from "@/app/map-styling/layer-enums";

export function floodLayersAreVisible(mapRef: MapRef, isVisible: boolean, floodIds: Array<string>) {
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

export function setLayerFilter(mapRef: MapRef, layerId: string, propertyId: string) {
    mapRef.getMap().setFilter(layerId, [
        "in",
        "id",
        propertyId
    ]);
}

export function monitoringStationLayersAreVisible(mapRef: MapRef, isVisible: boolean, monitoringStationIds: Array<string>) {
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

export function generateFloodPlaneLayer(type: string, severityLevel: number) {
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
        case "symbol":
            modifier = 0.25
            break;
    }
    return generateLayer(type, modifier, color);
}

export function generateStationLayer(stationType: string, type: string) {
    const modifier = type === "symbol" ? 0.25 : undefined;
    stationType === MeasureType.DOWNSTEAM_STAGE? stationType = MeasureType.UPSTREAM_STAGE : stationType;
    return generateLayer(type, modifier, undefined, stationType);
}

function iconSizeOnZoom() {
    const expression: ExpressionSpecification = [
        "interpolate",
        ["exponential", 1.5],
        ["zoom"],
        5,
        0.33,
        18,
        3
    ];
    return expression;
}

function generateLayer(type: string, modifier?: number, color?: string, image?: string): {} {
    const paintSpec: PaintSpecification = {};
    const layoutSpec: LayoutSpecification = {};
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
            return {}
    }
}

function layerColorBySeverity(severityLevel: number) {
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