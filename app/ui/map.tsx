'use client'
import {Map} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    DetailedFloodAreaWithWarning,
    FloodWarning,
    MonitoringStation
} from "@/app/services/flood-api-interfaces";
import {useDispatchContext} from "@/app/hooks/map-hook";
import {useWindowSize} from "@/app/hooks/utility-functions-hook"
import {generateFloodAreaGeoJSON, generateStationGeoJSON} from "@/app/services/geo-json-bootstrap";
import {generateFloodPlaneLayer, generateStationLayer, floodLayersAreVisible} from "@/app/map-styling/layers";
import {Layers, Markers, Sources} from "@/app/ui/map-widgets";
import MapLegend from "@/app/ui/map-legend";
import {useEffect, useRef, useState} from "react";
import {GeoJSON} from "geojson";
import {MapRef} from "react-map-gl/mapbox";
import {LayoutSpecification} from "mapbox-gl";
import {MeasureType} from "@/app/map-styling/layer-enums";

function loadMapImage(mapRef: MapRef, imageName: string, link: string) {
    mapRef.loadImage(link,
        (error, image) => {
        if (error) {throw error};
        if(image) {
            mapRef.addImage(imageName, image, {
                'pixelRatio': 6
            });
        }
    })
}

export default function FloodMap({currentFloodsMap, monitoringStations}: {
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
    monitoringStations: MonitoringStation[];
}) {
    const screenSize = useWindowSize();
    const dispatchContext = useDispatchContext();
    const mapRef = useRef<MapRef>(null);
    const [floodLayerIds, setFloodLayerIds] = useState(new Array<string>());
    const [monitoringStationIds, setMonitoringStationIds] = useState(new Array<string>());
    const [viewState, setViewState] = useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

    useEffect(() => {
        const latestTimer = setTimeout(() => {
            if(viewState.zoom >= 12) {
                if(mapRef.current){
                    floodLayersAreVisible(mapRef.current, true, floodLayerIds);
                }
            } else {
                if(mapRef.current){
                    floodLayersAreVisible(mapRef.current, false, floodLayerIds);
                }
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

    function addFloodPlaneLayer(id: string, type: string, source: string, filter: string, severityLevel: number) {
        const paint = generateFloodPlaneLayer(type, severityLevel);
        const layout: LayoutSpecification = {}
        layout.visibility = "none";
        setFloodLayerIds(curr => [...curr, id]);
        dispatchContext({type: "ADD_LAYER",
            payload:{
                layer:
                    {
                        id: id,
                        type: type,
                        source: source,
                        paint: paint,
                        filter: [
                            "==",
                            "id",
                            filter
                        ],
                        layout: layout,
                        severityLevel: severityLevel
                    }
            }
        });
    }

    function addMonitoringStationLayer(id: string, type: string, source: string) {
        const layout = generateStationLayer(id, type);
        setMonitoringStationIds((curr) => [...curr, id]);
        dispatchContext({type: "ADD_LAYER",
        payload:{
            layer:
                {
                    id: id,
                    type: type,
                    source: source,
                    layout: layout,
                    paint: {},
                    filter: [
                        "==",
                        "type",
                        id
                    ]
                }
        }})
    }

    function addMarker(long: number, lat: number, warning?: FloodWarning) {
        dispatchContext({type: "ADD_MARKER",
            payload:{
                marker:
                    {
                        warning: warning,
                        long: long,
                        lat: lat,
                        severityLevel: warning?.severityLevel
                    }
            }
        });
    }

    function populateMap() {
        const floodAreasGeoJSON = generateFloodAreaGeoJSON(Array.from(currentFloodsMap.values()));
        const stationsGeoJSON = generateStationGeoJSON(monitoringStations);
        if(floodAreasGeoJSON) {
            addSource("flood-areas", floodAreasGeoJSON);
        }
        if(stationsGeoJSON) {
            addSource("monitoring-stations", stationsGeoJSON);
        }
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            if(floodAreaWithWarning.currentWarning){
                addFloodPlaneLayer(
                    floodAreaWithWarning.notation + " line", "line",
                    "flood-areas",
                    floodAreaWithWarning.notation,
                    floodAreaWithWarning.currentWarning.severityLevel);
                addFloodPlaneLayer(
                    floodAreaWithWarning.notation + " fill", "fill",
                    "flood-areas",
                    floodAreaWithWarning.notation,
                    floodAreaWithWarning.currentWarning.severityLevel);
                addMarker(floodAreaWithWarning.long, floodAreaWithWarning.lat, floodAreaWithWarning.currentWarning);
            }
        });
        const station = monitoringStations[0];
        //monitoringStations.map((station: MonitoringStation) => {

        addMonitoringStationLayer(MeasureType.UPSTREAM_STAGE, "symbol", "monitoring-stations");
        addMonitoringStationLayer(MeasureType.DOWNSTEAM_STAGE, "symbol", "monitoring-stations");
        addMonitoringStationLayer(MeasureType.RAINFALL, "symbol", "monitoring-stations");
        addMonitoringStationLayer(MeasureType.TIDAL_LEVEL, "symbol", "monitoring-stations");
        addMonitoringStationLayer(MeasureType.GROUNDWATER, "symbol", "monitoring-stations");
        //});
        /*
        monitoringStations.map((station) => {
            if(station.long && station.lat){
                if(typeof station.long == "number" && typeof station.lat == "number") {
                    addMarker(station.long, station.lat);
                } else {
                    for(let i = 0; typeof station.long !== "number" && i < station.long?.length; i++) {
                        if(typeof station.lat !== "number"){
                            addMarker(station.long[i], station.lat[i]);
                        }
                    }
                }
            }
        })

         */
    }

   return(
       <div className="flex w-full items-center justify-between">
           <Map
               {...viewState}
               onMove={e =>setViewState(e.viewState)}
               style={{width: screenSize.width, height: screenSize.height}}
               mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=U2udwPDvVDDdAolS5wws"}
               mapboxAccessToken="pk.eyJ1IjoiY3JlbmFuZDAiLCJhIjoiY204MXRlY3lsMG1tcjJscXJzdThhMnRnbiJ9.MyrIyAKS0lnO1CP12NCguA"
               ref={mapRef}
               onLoad={(e) => {
                   if(mapRef.current){
                       loadMapImage(mapRef.current, MeasureType.UPSTREAM_STAGE,
                           "https://icons.veryicon.com/png/o/miscellaneous/eisens-gis-map-point-icon-library/river-system.png");
                       loadMapImage(mapRef.current, MeasureType.TIDAL_LEVEL,
                           "https://icons.veryicon.com/png/o/miscellaneous/eisens-gis-map-point-icon-library/river-and-lake-flow-monitoring-points.png");
                       loadMapImage(mapRef.current, MeasureType.GROUNDWATER,
                           "https://icons.veryicon.com/png/o/miscellaneous/wb_-thematic-schema-of-water-resources/groundwater-source.png");
                       loadMapImage(mapRef.current, MeasureType.RAINFALL,
                           "https://icons.veryicon.com/png/o/miscellaneous/eisens-gis-map-point-icon-library/light-rain-83.png");
                   }
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