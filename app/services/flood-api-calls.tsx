'use server'
import {
    DetailedFloodArea,
    DetailedFloodAreaWithWarning,
    FloodArea,
    FloodWarning,
    MonitoringStation,
    WaterLevelReading
} from "@/app/services/flood-api-interfaces";
import {GeoJSON} from "geojson";


export async function getCurrentFloods(): Promise<FloodWarning[]> {
    const currentFloodWarningsArray: FloodWarning[] = [];
    const floods = await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods');
    if(!floods.ok){
        return currentFloodWarningsArray
    }
    await floods.json().then(data => data.items.forEach(async (floodWarning: FloodWarning) => {
            currentFloodWarningsArray.push(floodWarning);
        }));
    return currentFloodWarningsArray;
}

export async function getLatestReadings(): Promise<WaterLevelReading[]> {
    const latestReadings: WaterLevelReading[] = [];
    const readings = await fetch('https://environment.data.gov.uk/flood-monitoring/data/readings?latest');
    if(!readings.ok){
        return latestReadings;
    }
    await readings.json().then(data => data.items.forEach(async (reading: WaterLevelReading) => {
            latestReadings.push(reading);
        }));
    return latestReadings;
}

export async function getAllMonitoringStations(): Promise<MonitoringStation[]> {
    const allStations: MonitoringStation[] = [];
    const stations = await fetch('https://environment.data.gov.uk/flood-monitoring/id/stations');
    if(!stations.ok){
        return allStations;
    }
    await stations.json().then(data => data.items.forEach(async (station: MonitoringStation) => {
            if(typeof station.label === "string"){
                allStations.push(station);
            }
        }));
    return allStations;
}

export async function getAllFloodAreas(): Promise<Map<string, DetailedFloodArea>> {
    const floodAreaMap: Map<string, DetailedFloodArea> = new Map();
    const areas = await fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas');
    if(!areas.ok){
        return floodAreaMap;
    }
    areas.json().then(data => data.items.forEach((floodArea: DetailedFloodArea) => {
            floodAreaMap.set(floodArea.fwdCode, floodArea);
        }));
    return floodAreaMap;
}

export async function getSpecificFloodArea(floodAreaId: string): Promise<DetailedFloodAreaWithWarning | null> {
    const floodArea = await fetch(`https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${floodAreaId}`);
    if(!floodArea.ok){
        return null;
    }
    return floodArea.json().then(data => data.items);
}

export async function getDetailedFloodAreasWithWarnings() {
    return getCurrentFloods()
        .then((floodWarnings) =>{
            const promises = floodWarnings.map((floodWarning)=> {
                return getSpecificFloodArea(floodWarning.floodAreaID);
            });
            return Promise.all(promises);
        });
}

export async function getFloodAreaGeoJson(floodAreaPolygon: string): Promise<GeoJSON | null> {
    const area =  await fetch(floodAreaPolygon);
    if(!area.ok){
        return null;
    }
    return area.json();
}

export async function getAllFloodAreaGeoJsons(floodAreas: (FloodArea | null)[]) {
    const promises = floodAreas.map((floodArea)=> {
        if(!floodArea){
            return null;
        }
        return getFloodAreaGeoJson(floodArea.polygon);
    });
    return Promise.all(promises);
}

export async function updateFloodAreaGeoJsons(currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>, currentFloodsArray: (DetailedFloodAreaWithWarning | null)[]) {
    const currentFloodGeoJsons: (GeoJSON | null)[] = await getAllFloodAreaGeoJsons(currentFloodsArray).then((geoJsons) => {
        return geoJsons;
    });
    currentFloodGeoJsons.map((geoJson: GeoJSON | null) => {
        if(geoJson){
            if (geoJson.type === "FeatureCollection") {
                if(geoJson.features[0].properties?.hasOwnProperty("FWS_TACODE")) {
                    const detailedFloodAreaWithWarning = currentFloodsMap.get(geoJson.features[0].properties.FWS_TACODE)
                    if(detailedFloodAreaWithWarning) {
                        const floodWarning = detailedFloodAreaWithWarning.currentWarning;
                        if(floodWarning){
                            floodWarning.floodAreaGeoJson = geoJson;
                        }
                    }
                }
            }
        }
    });
}