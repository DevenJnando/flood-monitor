'use client'
import {Map} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import {DetailedFloodAreaWithWarning, FloodWarning} from "@/app/services/flood-api-interfaces";
import {useDispatchContext} from "@/app/hooks/map-hook";
import {useWindowSize} from "@/app/hooks/utility-functions-hook"
import {Layers, Markers, Sources} from "@/app/ui/map-widgets";
import {GeoJSON} from "geojson";
import MapLegend from "@/app/ui/map-legend";
import {useEffect, useState} from "react";


export default function FloodMap({currentFloodsMap}: {
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
}) {
    const screenSize = useWindowSize();
    const dispatchContext = useDispatchContext();
    const [viewState, setViewState] = useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

    useEffect(() => {
        const latestTimer = setTimeout(() => {
            if(viewState.zoom >= 12) {
                dispatchContext({type: "SHOW_LAYERS"});
            } else {
                dispatchContext({type: "HIDE_LAYERS"});
            }
        }, 200);

        return () => clearTimeout(latestTimer);
    });

    function addSource(id: string, data: GeoJSON) {
        dispatchContext({type: "ADD_SOURCE",
            payload:{
                source:
                    {
                        id: id,
                        data: data
                    }
            }
        });
    }

    function generateLayer(type: string, color: string, modifier: number): {} {
        switch (type) {
            case "line":
                return {
                    'line-color': color,
                    'line-width': modifier
                }
            case "fill":
                return {
                    'fill-color': color,
                    'fill-opacity': modifier
                }
            default:
                return {}
        }
    }

    function addLayer(id: string, type: string, source: string, severityLevel: number) {
        let color: string = '#000000';
        let modifier: number = 0;
        if(type === 'line') {
            color = '#000000';
            modifier = 1.5;
        }
        else {
            modifier = 0.5;
            switch (severityLevel) {
                case 1:
                    color = '#720101';
                    break;
                case 2:
                    color = '#f80a0a';
                    break;
                case 3:
                    color = '#f5c60a';
                    break;
                case 4:
                    color = '#0868d5';
                    break;
            }
        }
        let paint = generateLayer(type, color, modifier)
        dispatchContext({type: "ADD_LAYER",
            payload:{
                layer:
                    {
                        id: id,
                        type: type,
                        source: source,
                        paint: paint,
                        layout: {visibility: "none"},
                        severityLevel: severityLevel
                    }
            }
        });
    }

    function addMarker(warning: FloodWarning, long: number, lat: number) {
        dispatchContext({type: "ADD_MARKER",
            payload:{
                marker:
                    {
                        warning: warning,
                        long: long,
                        lat: lat,
                        severityLevel: warning.severityLevel
                    }
            }
        });
    }

    function populateMap() {
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            if(floodAreaWithWarning.currentWarning){
                if (floodAreaWithWarning.currentWarning && floodAreaWithWarning.currentWarning.floodAreaGeoJson != undefined) {
                    addSource(floodAreaWithWarning.notation, floodAreaWithWarning.currentWarning.floodAreaGeoJson);
                }
                addLayer(
                    floodAreaWithWarning.notation + " line", "line",
                    floodAreaWithWarning.notation,
                    floodAreaWithWarning.currentWarning.severityLevel);
                addLayer(
                    floodAreaWithWarning.notation + " fill", "fill",
                    floodAreaWithWarning.notation,
                    floodAreaWithWarning.currentWarning.severityLevel);
                addMarker(floodAreaWithWarning.currentWarning, floodAreaWithWarning.long, floodAreaWithWarning.lat);
            }
        });
    }

   return(
       <div className="flex w-full items-center justify-between">
           <Map
               {...viewState}
               onMove={e =>setViewState(e.viewState)}
               style={{width: screenSize.width, height: screenSize.height}}
               mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=U2udwPDvVDDdAolS5wws"}
               mapboxAccessToken="pk.eyJ1IjoiY3JlbmFuZDAiLCJhIjoiY204MXRlY3lsMG1tcjJscXJzdThhMnRnbiJ9.MyrIyAKS0lnO1CP12NCguA"
               onLoad={(e) => {
                   populateMap();
               }}
            >
               <Markers />
               <Sources />
               <Layers />
               <MapLegend/>
           </Map>
       </div>
   );
}