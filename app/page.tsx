import Image from "next/image";
import * as React from "react";
import {Suspense} from "react";
import FloodMap from "@/app/ui/map";
import {
    getAllFloodAreas,
    getCurrentFloods,
    getFloodAreaGeoJson
} from "@/app/services/flood-api-calls";
import {DetailedFloodArea, FloodWarning} from "@/app/services/flood-api-interfaces";
import {MapProvider} from "@/app/hooks/map-hook";


export default async function Home() {
    const currentFloodsArray: FloodWarning[] = await getCurrentFloods()
        .then((data) =>{
            return data;
        })
    const allFloodAreas: Map<string, DetailedFloodArea> = await getAllFloodAreas()
        .then((data) => {
            return data;
        });
    currentFloodsArray.map((floodWarning: FloodWarning) => {
        const detailedFloodArea = allFloodAreas.get(floodWarning.floodAreaID)
        if(detailedFloodArea) {
            floodWarning.detailedFloodArea = detailedFloodArea;
        }
    })
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
              <Suspense fallback={"Loading..."}>
                  <div className="flex flex-col">
                      this uses Environment Agency flood and river level data from the real-time data API (Beta)
                  </div>
                  <MapProvider>
                      <FloodMap
                          currentFloodsArray={currentFloodsArray}
                      />
                  </MapProvider>
              </Suspense>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          </footer>
        </div>
    );
}
