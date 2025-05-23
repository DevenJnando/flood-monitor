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
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods')
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error("Failed to fetch current floods from API call...\n"
                + error.message);
        })
        .then(res => res.json())
        .then(data => data.items.forEach(async (floodWarning: FloodWarning) => {
            currentFloodWarningsArray.push(floodWarning);
        }));
    return currentFloodWarningsArray;
}

export async function getLatestReadings(): Promise<WaterLevelReading[]> {
    const latestReadings: WaterLevelReading[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/data/readings?latest')
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error("Failed to fetch latest readings from API call...\n"
            + error.message);
        })
        .then(res => res.json())
        .then(data => data.items.forEach(async (reading: WaterLevelReading) => {
            latestReadings.push(reading);
        }));
    return latestReadings;
}

export async function getAllMonitoringStations(): Promise<MonitoringStation[]> {
    const stations: MonitoringStation[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/stations')
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error("Failed to fetch stations from API call...\n"
                + error.message);
        })
        .then(res => res.json())
        .then(data => data.items.forEach(async (station: MonitoringStation) => {
            if(typeof station.label === "string"){
                stations.push(station);
            }
        }));
    return stations;
}

export async function getAllFloodAreas(): Promise<Map<string, DetailedFloodArea>> {
    const floodAreaMap: Map<string, DetailedFloodArea> = new Map();
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error("Failed to fetch all flood areas from API call...\n"
                + error.message);
        })
        .then(res => res.json())
        .then(data => data.items.forEach((floodArea: DetailedFloodArea) => {
            floodAreaMap.set(floodArea.fwdCode, floodArea);
        }));
    return floodAreaMap;
}

export async function getSpecificFloodArea(floodAreaId: string): Promise<DetailedFloodAreaWithWarning> {
    return await fetch(`https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${floodAreaId}`)
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error(`Failed to fetch flood area with id ${floodAreaId} from API call...\n`
                + error.message);
        })
        .then(res => res.json())
        .then(data => data.items);
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
        .catch((error: Error) => {
            console.error("API fetch error...");
            throw new Error("Failed to fetch geoJSON from API call...\n"
                + error.message);
        })
        .then(res => res.json());
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