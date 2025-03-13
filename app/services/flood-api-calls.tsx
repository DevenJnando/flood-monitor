'use server'
import {DetailedFloodArea, FloodArea, FloodWarning} from "@/app/services/flood-api-interfaces";
import {GeoJSON} from "geojson";


export async function getCurrentFloods(): Promise<FloodWarning[]> {
    const currentFloodWarningsArray: FloodWarning[] = [];
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods')
        .then(res => res.json())
        .then(data => data.items.forEach(async (floodWarning: FloodWarning) => {
            currentFloodWarningsArray.push(floodWarning);
        }));
    return currentFloodWarningsArray;
}

export async function getAllFloodAreas(): Promise<Map<string, DetailedFloodArea>> {
    const floodAreaMap: Map<string, DetailedFloodArea> = new Map();
    await fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas')
        .then(res => res.json())
        .then(data => data.items.forEach((floodArea: DetailedFloodArea) => {
            floodAreaMap.set(floodArea.fwdCode, floodArea);
        }));
    return floodAreaMap;
}

export async function getSpecificFloodArea(floodAreaId: string) {
    return await fetch(`https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${floodAreaId}`)
        .then(res => res.json())
        .then(data => data.items);
}

export async function getFloodAreaGeoJson(floodAreaPolygon: string): Promise<GeoJSON> {
    return await fetch(floodAreaPolygon)
        .then(res => res.json());
}

/*
export async function getFloodAreaGeoJsonForCurrentFloods(currentFloodsArray: FloodWarning[],
                                                          allFloodAreas: Map<string, DetailedFloodArea>): Promise<void> {
    currentFloodsArray.map(async (floodWarning: FloodWarning) => {
        const floodWarningArea = allFloodAreas.get(floodWarning.floodAreaID);
        floodWarning.floodAreaGeoJson = await getFloodAreaGeoJson(floodWarning.floodArea.polygon)
            .then((geoJson) => {
                return geoJson;
            });
        if(floodWarningArea){
            floodWarning.detailedFloodArea = floodWarningArea;
        }
    });
}

 */