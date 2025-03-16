'use client'
import {Map} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from "react";
import {MapRef} from "react-map-gl/mapbox";
import {useRef} from "react";
import {DetailedFloodAreaWithWarning} from "@/app/services/flood-api-interfaces";
import {useDispatchContext} from "@/app/hooks/map-hook";
import {Layers, Markers, Sources} from "@/app/ui/map-widgets";


export default function FloodMap({currentFloodsMap}: {
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
}) {
    const dispatchContext = useDispatchContext();
    const [viewState, setViewState] = React.useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

    function populateMap() {
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            dispatchContext({type: "ADD_SOURCE",
                payload:{
                source:
                    {
                        id: floodAreaWithWarning.notation,
                        data: floodAreaWithWarning.currentWarning?.floodAreaGeoJson
                    }
                }
            })
            dispatchContext({type: "ADD_LAYER",
                payload:{
                layer:
                    {
                        id: floodAreaWithWarning.notation,
                        type: 'line',
                        source: floodAreaWithWarning.notation,
                        severityLevel: floodAreaWithWarning.currentWarning?.severityLevel
                    }
                }
            })
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
               onLoad={(e) => {
                   populateMap();
               }}
            >
               <Markers />
               <Sources />
               <Layers />
           </Map>
            </div>
   );
}