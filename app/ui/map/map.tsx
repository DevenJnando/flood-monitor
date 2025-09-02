'use client'
import {Map} from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    DetailedFloodAreaWithWarning,
    FloodWarning,
    MonitoringStation
} from "../../services/flood-api-interfaces";
import {useDispatchContext} from "../../hooks/map/map-hook";
import {getHostName, useWindowSize} from "../../hooks/generic-hooks/utility-functions-hook"
import {generateFloodAreaGeoJSON, generateStationGeoJSON} from "../../services/geo-json-bootstrap";
import {
    generateFloodPlaneLayer,
    generateStationLayer,
    floodLayersAreVisible,
    setLayerFilter
} from "../../map-styling/layers";
import {Layers, Markers, Sources} from "../../ui/map-widgets/map-widgets";
import MapLegend from "../../ui/map/map-legend";
import {useEffect, useRef, useState} from "react";
import {Feature, FeatureCollection} from "geojson";
import {MapRef} from "react-map-gl/mapbox";
import {PointLike} from "mapbox-gl";
import {MeasureType} from "../../map-styling/layer-enums";
import {useSelectedMonStnDispatchContext} from "../../hooks/monitoring-station/selected-monitoring-station-hook";
import {useToastContext} from "../../hooks/toast/toast-hook";
import {flushSync} from "react-dom";
import {SignedLayoutSpecification, SignedPaintSpecification} from "../../ui/map/map-interfaces";
import {useSelectedFloodWarningDispatchContext} from "../../hooks/flood/selected-flood-hook";

function loadMapImage(mapRef: MapRef, imageName: string, link: string) {
    mapRef.loadImage(link,
        (error, image) => {
        if (error) {throw error};
        if(image) {
            mapRef.addImage(imageName, image, {
                sdf : true,
                pixelRatio: 10
            });
        }
    })
}

function selectStationsOnClick(mapRef: MapRef, selectedPoint: PointLike, selectableStations: string[],
                               selectedStationIds: string[]) : string | undefined {
    const selectedStations = mapRef.queryRenderedFeatures(selectedPoint, {
        layers: selectableStations
    });

    try{
        const highlightedLayerId = selectedStations[0].layer?.id + " highlighted";
        setLayerFilter(mapRef, highlightedLayerId, selectedStations[0].properties?.id);
        selectedStationIds.forEach((id) => {
            if(id !== highlightedLayerId) {
                setLayerFilter(mapRef, id, "no-station-selected");
            }
        });
        return selectedStations[0].properties?.id;
    } catch(error) {
        selectedStationIds.forEach((id) => {
            setLayerFilter(mapRef, id, "no-station-selected");
        });
        console.error("Selected point does not contain a valid monitoring station id \n" + error);
        return undefined;
    }
}

export default function FloodMap(
    {
        mapboxAccessToken,
        currentFloodsMap,
        monitoringStationsMap,
        selectedFloodID = undefined
}: {
    mapboxAccessToken: string | undefined,
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
    monitoringStationsMap: Map<string, MonitoringStation>;
    selectedFloodID: string | undefined;
}) {

    const screenSize = useWindowSize();
    const dispatchContext = useDispatchContext();
    const selectedFloodDispatchContext = useSelectedFloodWarningDispatchContext();
    const selectedMonStnDispContext = useSelectedMonStnDispatchContext();
    const mapRef = useRef<MapRef>(null);
    const [selectedMonitoringStationIds, setSelectedMonitoringStationIds] = useState<string[]>(new Array<string>());
    const [floodLayerIds, setFloodLayerIds] = useState<string[]>(new Array<string>());
    const [, setMonitoringStationIds] = useState<string[]>(new Array<string>());
    const [viewState, setViewState] = useState({
        longitude: -1.47663,
        latitude: 52.92277,
        zoom: 6
    });

    const toastNotification = useToastContext();

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


    function addSource(id: string, data: FeatureCollection | Feature) {
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
        const paint: SignedPaintSpecification = generateFloodPlaneLayer(type, severityLevel);
        const layout: SignedLayoutSpecification = {discriminator:"LayoutSpecification", visibility: "none"};
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

    function addMonitoringStationLayer(id: string, type: string, source: string, iconColour: string) {
        const layout: SignedLayoutSpecification = generateStationLayer(id, type);
        setMonitoringStationIds((curr) => [...curr, id]);
        // sets the initial symbol layers for the monitoring stations
        dispatchContext({
            type: "ADD_LAYER",
            payload: {
                layer:
                    {
                        id: id,
                        type: type,
                        source: source,
                        layout: layout,
                        paint: {
                            discriminator: "PaintSpecification",
                            "icon-color": iconColour
                        },
                        filter: [
                            "==",
                            "type",
                            id
                        ]
                    }
            }
        });

        // sets an additional layer which will become visible if a station is selected by the user
        setSelectedMonitoringStationIds((curr) => [...curr, id + " highlighted"]);
        dispatchContext({
            type: "ADD_LAYER",
            payload: {
                layer:
                    {
                        id: id + " highlighted",
                        type: type,
                        source: source,
                        layout: layout,
                        paint: {
                            discriminator: "PaintSpecification",
                            "icon-color": "#13d736"
                        },
                        filter: [
                            "in",
                            "id",
                            "no-station-selected"
                        ]
                    }
            }
        });
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


    function floodMapIsEmpty() {
        if(currentFloodsMap.size == 0) {
            flushSync(() => {
                toastNotification.warningWithContent({
                    id: "warning",
                    heading: "No floods found",
                    message: "No floods retrieved from API. Double check the official UK Live Flood Map: ",
                    content: (props) => (
                        <ul className="space-y-10 p-5" style={{ flex: '1' }}>
                            <li className="font-medium text-lg my-3 text-900">{props.message.summary}</li>
                            <li className="font-normal text-sm">{props.message.detail}</li>
                            <li className="flex align-items-center gap-2">
                                <a href="https://check-for-flooding.service.gov.uk/?v=map-live&lyr=mv,ts,tw,ta&ext=-5.090939,50.263438,2.704673,53.004129">
                                    Live Flood Map
                                </a>
                            </li>
                        </ul>
                    )
                });
            });
        }
    }


    function monitoringStationsIsEmpty() {
        if(monitoringStationsMap.size == 0) {
            flushSync(() => {
                toastNotification.error({
                    id: "error",
                    heading: "Failed to fetch monitoring stations",
                    message: "It is highly likely that the flood API has failed. Please check back later.",
                });
            });
        }
    }


    function selectFloodOnLoad(floodArea: DetailedFloodAreaWithWarning) {
        mapRef?.current?.flyTo({
            center: [floodArea.long, floodArea.lat],
            zoom: 15,
            essential: true
        });
        selectedFloodDispatchContext({
            type: "SELECT_WARNING",
            payload: {newWarning: floodArea.currentWarning}
        });
    }


    function populateMap() {
        const floodAreasGeoJSON = generateFloodAreaGeoJSON(Array.from(currentFloodsMap.values()));
        const stationsGeoJSON = generateStationGeoJSON(Array.from(monitoringStationsMap.values()));
        if(floodAreasGeoJSON) {
            addSource("flood-areas", floodAreasGeoJSON);
        }
        if(stationsGeoJSON) {
            addSource("monitoring-stations", stationsGeoJSON);
        }
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            if(floodAreaWithWarning.currentWarning){
                const selectOnLoad: boolean = floodAreaWithWarning.notation == selectedFloodID
                if(selectOnLoad){
                    selectFloodOnLoad(floodAreaWithWarning)
                }
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
                addMarker(
                    floodAreaWithWarning.long,
                    floodAreaWithWarning.lat,
                    floodAreaWithWarning.currentWarning);
            }
        });
        addMonitoringStationLayer(MeasureType.UPSTREAM_STAGE, "symbol", "monitoring-stations", "#5074d2");
        addMonitoringStationLayer(MeasureType.DOWNSTEAM_STAGE, "symbol", "monitoring-stations", "#5074d2");
        addMonitoringStationLayer(MeasureType.RAINFALL, "symbol", "monitoring-stations", "#213fec");
        addMonitoringStationLayer(MeasureType.TIDAL_LEVEL, "symbol", "monitoring-stations", "#bb6c04");
        addMonitoringStationLayer(MeasureType.GROUNDWATER, "symbol", "monitoring-stations", "#020202");
    }

   return(
       <div className="flex w-full items-center justify-between">
           <Map
               {...viewState}
               onMove={e =>setViewState(e.viewState)}
               style={{width: screenSize.width, height: screenSize.height}}
               mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=U2udwPDvVDDdAolS5wws"}
               mapboxAccessToken={mapboxAccessToken}
               ref={mapRef}
               onLoad={() => {
                   floodMapIsEmpty();
                   monitoringStationsIsEmpty();
                   if(mapRef.current){
                       mapRef.current.resize()
                       // REMEMBER to fix this! This is temporary just so the images load in development.
                       loadMapImage(mapRef.current, MeasureType.UPSTREAM_STAGE,
                           process.env.PROTOCOL + getHostName() + ":3000/river-system.png");
                       loadMapImage(mapRef.current, MeasureType.TIDAL_LEVEL,
                           process.env.PROTOCOL + getHostName() + ":3000/river-and-lake-flow-monitoring-points.png");
                       loadMapImage(mapRef.current, MeasureType.GROUNDWATER,
                           process.env.PROTOCOL + getHostName() + ":3000/groundwater-source.png");
                       loadMapImage(mapRef.current, MeasureType.RAINFALL,
                           process.env.PROTOCOL + getHostName() + ":3000/light-rain-83.png");
                   }
                   populateMap();
               }}
               onClick={(e) => {
                   if(mapRef.current){
                       const selectedStationId = selectStationsOnClick(mapRef.current, e.point,
                           [
                               MeasureType.UPSTREAM_STAGE,
                               MeasureType.DOWNSTEAM_STAGE,
                               MeasureType.TIDAL_LEVEL,
                               MeasureType.GROUNDWATER,
                               MeasureType.RAINFALL
                           ], selectedMonitoringStationIds);
                       if(selectedStationId) {
                           selectedMonStnDispContext({
                               type: "SELECT_STATION",
                               payload: {newStation: monitoringStationsMap.get(selectedStationId)}
                           });
                       } else {
                           selectedMonStnDispContext({
                               type: "COLLAPSE_STATION",
                               payload: {newStation: undefined}
                           });
                       }
                   }
               }}
            >
               <Markers />
               <Sources />
               <Layers />
               <MapLegend mapRef={mapRef} currentFloodsMap={currentFloodsMap} monitoringStationsMap={monitoringStationsMap}/>
           </Map>
       </div>
   );
}