import {
    DetailedFloodAreaWithWarning,
    Measure,
    MeasureReading,
    MonitoringStation
} from "../../services/flood-api-interfaces";
import {
    getAllMonitoringStations,
    getDetailedFloodAreasWithWarnings, getLatestReadings,
    updateFloodAreaGeoJsons
} from "../../services/flood-api-calls";
import {MapSkeleton} from "../../ui/map/map-skeleton";
import FloodMap from "../../ui/map/map";
import {Suspense} from "react";
import * as React from "react";


export default async function MapRenderer({selectedFloodID=undefined}: {selectedFloodID : string | undefined}) {

    const currentFloodsMap: Map<string, DetailedFloodAreaWithWarning> = new Map<string, DetailedFloodAreaWithWarning>();
    const monitoringStationsMap: Map<string, MonitoringStation> = new Map<string, MonitoringStation>();
    const latestMeasureReadingsMap: Map<string, MeasureReading> = new Map<string, MeasureReading>();

    const currentFloodsArray: DetailedFloodAreaWithWarning[] = await getDetailedFloodAreasWithWarnings().then((floodWarnings) =>{
        return floodWarnings;
    });
    currentFloodsArray.forEach((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
        currentFloodsMap.set(floodAreaWithWarning.notation, floodAreaWithWarning);
    })
    await updateFloodAreaGeoJsons(currentFloodsMap, currentFloodsArray);

    const monitoringStations = await getAllMonitoringStations();
    const latestMeasureReadings = await getLatestReadings();

    latestMeasureReadings.forEach((measureReading: MeasureReading) => {
        latestMeasureReadingsMap.set(measureReading.measure, measureReading);
    });

    monitoringStations.forEach((station: MonitoringStation) => {
        if(station.measures) {
            station.measures.forEach((measure: Measure) => {
                const reading: MeasureReading | undefined = latestMeasureReadingsMap.get(measure["@id"]);
                if(reading) {
                    measure.latestReading = reading;
                }
            })
        }
        monitoringStationsMap.set(station.notation, station);
    });

    return(
        <Suspense fallback={<MapSkeleton/>}>
            <FloodMap
                mapboxAccessToken={process.env.MAPBOX_TOKEN}
                currentFloodsMap={currentFloodsMap}
                monitoringStationsMap={monitoringStationsMap}
                selectedFloodID={selectedFloodID}/>
        </Suspense>
    )
}