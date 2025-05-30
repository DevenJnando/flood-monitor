import * as React from "react";
import FloodMap from "@/app/ui/map/map";
import {
    getAllMonitoringStations,
    getDetailedFloodAreasWithWarnings, getLatestReadings,
    updateFloodAreaGeoJsons
} from "@/app/services/flood-api-calls";
import {
    DetailedFloodAreaWithWarning, Measure, MeasureReading, MonitoringStation
} from "@/app/services/flood-api-interfaces";
import {MapProvider} from "@/app/hooks/map/map-hook";
import SelectedFlood from "@/app/ui/selected-flood/selected-flood";
import SelectedMonitoringStation from "@/app/ui/selected-monitoring-station/selected-monitoring-station";
import {SelectedFloodProvider} from "@/app/hooks/flood/selected-flood-hook";
import {SelectedMonStnProvider} from "@/app/hooks/monitoring-station/selected-monitoring-station-hook";
import {ToastProvider} from "@/app/hooks/toast/toast-hook";


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


export default function Home() {
    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start content-evenly">
              <MapProvider>
                  <SelectedFloodProvider>
                      <SelectedMonStnProvider>
                          <div className="flex flex-col relative">
                              <SelectedFlood/>
                              <SelectedMonitoringStation/>
                              <aside className="fixed top-0 right-0 z-40">
                                  <p className="text-black">this uses Environment Agency flood and river level data from the real-time data API (Beta)</p>
                              </aside>
                              <ToastProvider>
                                  <FloodMap
                                      currentFloodsMap={currentFloodsMap}
                                      monitoringStationsMap={monitoringStationsMap}
                                  />
                              </ToastProvider>
                          </div>
                      </SelectedMonStnProvider>
                  </SelectedFloodProvider>
              </MapProvider>
          </main>
        </div>
    );
}
