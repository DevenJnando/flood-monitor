import * as React from "react";
import {MapProvider} from "@/app/hooks/map/map-hook";
import {MapSkeleton} from "@/app/ui/map/map-skeleton";
import SelectedFlood from "@/app/ui/selected-flood/selected-flood";
import SelectedMonitoringStation from "@/app/ui/selected-monitoring-station/selected-monitoring-station";
import {SelectedFloodProvider} from "@/app/hooks/flood/selected-flood-hook";
import {SelectedMonStnProvider} from "@/app/hooks/monitoring-station/selected-monitoring-station-hook";
import {ToastProvider} from "@/app/hooks/toast/toast-hook";
import Navbar from "@/app/ui/navbar/navbar"
import {Suspense} from "react";
import MapRenderer from "@/app/ui/map/map-renderer";
import FloodMap from "@/app/ui/map/map";


export default async function Home(
    {
        searchParams,
    }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    let id = params.id
    if(id){
        if(typeof(id) != "string"){
            id = ""
        }
    }
    const selectedFloodID = id
    return (
        <div className="font-[family-name:var(--font-lato))]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
              <Navbar>
              </Navbar>
              <Suspense fallback={<MapSkeleton/>}>
                  <MapProvider>
                      <SelectedFloodProvider>
                          <SelectedMonStnProvider>
                              <div className="flex flex-col relative">
                                      <SelectedFlood/>
                                      <SelectedMonitoringStation/>
                                      <ToastProvider>
                                          <MapRenderer selectedFloodID={selectedFloodID}/>
                                      </ToastProvider>
                              </div>
                          </SelectedMonStnProvider>
                      </SelectedFloodProvider>
                  </MapProvider>
              </Suspense>
          </main>
        </div>
    );
}
