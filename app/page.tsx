import * as React from "react";
import FloodMap from "@/app/ui/map";
import {
    getDetailedFloodAreasWithWarnings,
    updateFloodAreaGeoJsons
} from "@/app/services/flood-api-calls";
import {
    DetailedFloodAreaWithWarning
} from "@/app/services/flood-api-interfaces";
import {MapProvider} from "@/app/hooks/map-hook";
import SelectedFlood from "@/app/ui/selected-flood";
import {SelectedFloodProvider} from "@/app/hooks/selected-flood-hook";


const currentFloodsMap: Map<string, DetailedFloodAreaWithWarning> = new Map<string, DetailedFloodAreaWithWarning>();
const currentFloodsArray: DetailedFloodAreaWithWarning[] = await getDetailedFloodAreasWithWarnings().then((floodWarnings) =>{
    return floodWarnings;
});
currentFloodsArray.map((floodAreaWithWarning) => {
    currentFloodsMap.set(floodAreaWithWarning.notation, floodAreaWithWarning);
})
await updateFloodAreaGeoJsons(currentFloodsMap, currentFloodsArray)


export default function Home() {

    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start content-evenly">
              <MapProvider>
                  <SelectedFloodProvider>
                      <div className="flex flex-col relative">
                          <SelectedFlood/>
                          <aside className="fixed top-0 right-0 z-40">
                              <p className="text-black">this uses Environment Agency flood and river level data from the real-time data API (Beta)</p>
                          </aside>
                          <FloodMap
                              currentFloodsMap={currentFloodsMap}
                          />
                      </div>
                  </SelectedFloodProvider>
              </MapProvider>
          </main>
        </div>
    );
}
