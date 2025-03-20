import Image from "next/image";
import * as React from "react";
import {Suspense} from "react";
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
        <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
              <div className="flex flex-col">
                  <p>this uses Environment Agency flood and river level data from the real-time data API (Beta)</p>
              </div>
              <MapProvider>
                  <SelectedFloodProvider>
                      <FloodMap
                          currentFloodsMap={currentFloodsMap}
                      />
                      <SelectedFlood/>
                  </SelectedFloodProvider>
              </MapProvider>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          </footer>
        </div>
    );
}
