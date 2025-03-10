import {FloodArea, FloodWarning} from "@/app/services/flood-api-interfaces";


export async function getCurrentFloods() {
    const currentFloodWarningsArray: FloodWarning[] = [];
    const floodWarningData = await fetch('https://environment.data.gov.uk/flood-monitoring/id/floods');
    const floodWarningJson = await floodWarningData.json();
    floodWarningJson.items.forEach((floodWarning: FloodWarning) => {
        currentFloodWarningsArray.push(floodWarning);
    })
    return currentFloodWarningsArray;
}

export async function getAllFloodAreas() {
    const floodAreaArray: FloodArea[] = [];
    const floodAreaData = await fetch('https://environment.data.gov.uk/flood-monitoring/id/floodAreas');
    const floodAreaJson = await floodAreaData.json();
    floodAreaJson.items.forEach((floodArea: FloodArea) => {
        floodAreaArray.push(floodArea);
    })
    return floodAreaArray;
}

export async function getFloodAreaGeoJson(floodAreaPolygon: string) {
    const floodAreaGeoJsonResponse = await fetch(floodAreaPolygon);
    return floodAreaGeoJsonResponse.json();
}