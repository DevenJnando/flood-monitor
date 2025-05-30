'use server'
import {
    DetailedFloodArea,
    DetailedFloodAreaWithWarning,
    FloodArea,
    FloodWarning,
    MonitoringStation,
    MeasureReading
} from "@/app/services/flood-api-interfaces";
import {GeoJSON} from "geojson";


export async function getCurrentFloods(): Promise<FloodWarning[]> {
    const currentFloodWarningsArray: FloodWarning[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods')
        .then(res => res.json())
        .then(data => data.items.forEach(async (floodWarning: FloodWarning) => {
            currentFloodWarningsArray.push(floodWarning);
        }))
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return currentFloodWarningsArray;
        });
    return currentFloodWarningsArray;
}

export async function getLatestReadings(): Promise<MeasureReading[]> {
    const latestReadings: MeasureReading[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/data/readings?latest')
        .then(res => res.json())
        .then(data => data.items.forEach(async (reading: MeasureReading) => {
            latestReadings.push(reading);
        }))
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return latestReadings;
        });
    return latestReadings;
}

export async function getAllMonitoringStations(): Promise<MonitoringStation[]> {
    const stations: MonitoringStation[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/stations')
        .then(res => res.json())
        .then(data => data.items.forEach(async (station: MonitoringStation) => {
            if(typeof station.label === "string"){
                stations.push(station);
            }
        }))
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return stations;
        });
    return stations;
}

export async function getAllFloodAreas(): Promise<Map<string, DetailedFloodArea>> {
    const floodAreaMap: Map<string, DetailedFloodArea> = new Map();
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
        .then(res => res.json())
        .then(data => data.items.forEach((floodArea: DetailedFloodArea) => {
            floodAreaMap.set(floodArea.fwdCode, floodArea);
        }))
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return floodAreaMap;
        });
    return floodAreaMap;
}

export async function getSpecificFloodArea(floodAreaId: string): Promise<DetailedFloodAreaWithWarning> {
    return await fetch(`https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${floodAreaId}`)
        .then(res => res.json())
        .then(data => data.items)
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return undefined;
        });
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

export async function getFloodAreaGeoJson(floodAreaPolygon: string): Promise<GeoJSON> {
    return await fetch(floodAreaPolygon)
        .then(res => res.json())
        .catch((error: Error) => {
            console.error("API fetch error: ", error);
            return undefined;
        });
}

export async function getAllFloodAreaGeoJsons(floodAreas: FloodArea[]) {
    const promises = floodAreas.map((floodArea)=> {
        return getFloodAreaGeoJson(floodArea.polygon);
    });
    return Promise.all(promises);
}

export async function updateFloodAreaGeoJsons(currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>, currentFloodsArray: DetailedFloodAreaWithWarning[]) {
    const currentFloodGeoJsons: GeoJSON[] = await getAllFloodAreaGeoJsons(currentFloodsArray).then((geoJsons) => {
        return geoJsons;
    });
    currentFloodGeoJsons.map((geoJson: GeoJSON) => {
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
    });
}