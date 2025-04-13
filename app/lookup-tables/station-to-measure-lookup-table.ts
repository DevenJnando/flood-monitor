import {Measure} from "@/app/services/flood-api-interfaces";

const stationToMeasure: Map<string, Measure[]> = new Map();

export function getStationToMeasureLookupTable(): Map<string, Measure[]> {
    return stationToMeasure;
}

export function addStationToMeasureLookup(stationId: string, measures: Measure[]) {
    stationToMeasure.set(stationId, measures);
}

export function removeStationToMeasureLookup(stationId: string) {
    stationToMeasure.delete(stationId);
}

export function appendMeasureById(stationId: string, measure: Measure) {
    const existingMeasures = stationToMeasure.get(stationId);
    if(existingMeasures) {
        stationToMeasure.set(stationId, [measure, ...existingMeasures]);
    }
}

export function removeMeasureById(stationId: string, measureId: string) {
    const existingMeasures = stationToMeasure.get(stationId);
    if(existingMeasures) {
        stationToMeasure.set(stationId, existingMeasures
            .filter((measure) => measure["@id"] !== measureId));
    }
}

export function getMeasureById(stationId: string): Measure[] | undefined {
    return stationToMeasure.get(stationId);
}