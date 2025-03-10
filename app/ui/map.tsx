'use client'
import {Map} from "react-map-gl/mapbox";
import * as React from "react";
import {MapRef} from "react-map-gl/mapbox";
import {useRef} from "react";
import {Suspense} from "react";
import {getAllFloodAreas, getCurrentFloods} from '@/app/services/flood-api-calls'
import {addSourceToMapWithLayer} from "@/app/ui/map-functions";
import {FloodWarning} from "@/app/services/flood-api-interfaces";

const currentFloodsArray = await getCurrentFloods();


export function populateMap(mapRef: MapRef | null) {
    currentFloodsArray.map((floodWarning: FloodWarning) => {
        console.log(floodWarning.floodArea["@id"]);
        void addSourceToMapWithLayer(mapRef, floodWarning.floodArea);
    });
}

export default function FloodMap() {

    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = React.useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

   return( <div className="flex w-full items-center justify-between">
           <Map
               {...viewState}
               onMove={e =>setViewState(e.viewState)}
               style={{width: 800, height: 600}}
               mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=U2udwPDvVDDdAolS5wws"}
               mapboxAccessToken="pk.eyJ1IjoiY3JlbmFuZDAiLCJhIjoiY204MXRlY3lsMG1tcjJscXJzdThhMnRnbiJ9.MyrIyAKS0lnO1CP12NCguA"
               ref={mapRef}
               onLoad={(e) => {
                   if(mapRef) {
                       populateMap(mapRef.current);
                   }
               }}
            />
           <Suspense fallback={<div>Loading...</div>}>
               <div id={"current-floods"}>
                   {currentFloodsArray.map((floodWarning: FloodWarning) => (
                       <p className="mt-2 text-sm font-bold text-blue-400"
                          key={floodWarning["@id"]}>
                           {floodWarning.description}
                       </p>
                   ))}
               </div>
           </Suspense>
            </div>
   );
}