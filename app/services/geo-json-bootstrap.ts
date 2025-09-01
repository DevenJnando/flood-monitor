import {DetailedFloodAreaWithWarning, MonitoringStation} from "../services/flood-api-interfaces";
import {Feature, GeoJSON} from "geojson";

function defaultFeature() {
    const stationGeoJSONFeature: Feature = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [],
        },
        properties: {
            id: ""
        }
    }
    return stationGeoJSONFeature;
}

function collectFeaturesInGeoJSON(features: Feature[]) {
    const geoJson: GeoJSON = {
        type: "FeatureCollection",
        features: features
    }
    return geoJson;
}

export function generateFloodAreaGeoJSON(floodAreas: DetailedFloodAreaWithWarning[]) {
    const features: Feature[] = floodAreas.map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
        const feature: Feature = defaultFeature();
        if (floodAreaWithWarning.currentWarning && floodAreaWithWarning.currentWarning.floodAreaGeoJson != undefined) {
            feature.geometry.type = "MultiPolygon";
            if(floodAreaWithWarning.currentWarning.floodAreaGeoJson.type === "FeatureCollection"){
                const floodAreaFeatures = floodAreaWithWarning.currentWarning.floodAreaGeoJson.features;
                feature.geometry = floodAreaFeatures[0].geometry;
                feature.properties = floodAreaFeatures[0].properties;
                if (feature.properties){
                    feature.properties.id = floodAreaWithWarning.notation;
                }
            }
        }
        return feature;
    });
    return collectFeaturesInGeoJSON(features);
}

export function generateStationGeoJSON(monitoringStations: MonitoringStation[]) {
    const features: Feature[] = monitoringStations.map((station: MonitoringStation) => {
        const stationGeoJSONFeature: Feature = defaultFeature()
        if(typeof station.long === "number" && typeof station.lat === "number" && stationGeoJSONFeature.geometry.type === "Point"){
            stationGeoJSONFeature.geometry.coordinates = [station.long, station.lat];
            if (stationGeoJSONFeature.properties) {
                stationGeoJSONFeature.properties.id = station.notation;
            }
            if(station.measures){
                if(station.measures.length != 0) {
                    if (stationGeoJSONFeature.properties){
                        stationGeoJSONFeature.properties.type = station.measures[0].qualifier;
                    }
                }
            }
        }
        return stationGeoJSONFeature;
    });
    return collectFeaturesInGeoJSON(features)
}