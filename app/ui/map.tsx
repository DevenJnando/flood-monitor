'use client'
import {Map} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from "react";
import {MapRef} from "react-map-gl/mapbox";
import {useRef} from "react";
import {Suspense} from "react";
import {addSourceToMapWithLayer} from "@/app/ui/map-functions";
import {DetailedFloodAreaWithWarning, FloodWarning} from "@/app/services/flood-api-interfaces";
import {useDispatchContext} from "@/app/hooks/map-hook";
import {Markers} from "@/app/ui/map-widgets";
import {GeoJSON} from "geojson";


export default function FloodMap({currentFloodsMap}: {
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
}) {
    const mapRef = useRef<MapRef>(null);
    const dispatchContext = useDispatchContext();
    const [viewState, setViewState] = React.useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

    function populateMap(mapRef: MapRef | null) {
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            console.log(floodAreaWithWarning.currentWarning?.floodAreaGeoJson);
            mapRef?.getMap().addSource(floodAreaWithWarning.notation,
                {type:"geojson", data: floodAreaWithWarning.currentWarning?.floodAreaGeoJson});
            mapRef?.getMap().addLayer({
                id: floodAreaWithWarning.notation,
                type: 'line',
                source: floodAreaWithWarning.notation,
                layout: {},
                paint: {
                    'line-color': '#000',
                    'line-width': 3
                }
            });
            dispatchContext({type: "ADD_MARKER",
                payload:{
                marker:
                    {
                        long: floodAreaWithWarning.long,
                        lat: floodAreaWithWarning.lat,
                        severityLevel: floodAreaWithWarning.currentWarning?.severityLevel
                    }
                }
            });
        });
    }

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
            >
               <Markers />
           </Map>
            </div>
   );
}