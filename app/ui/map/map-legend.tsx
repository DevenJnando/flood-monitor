"use client"
import {RefObject, useEffect, useState} from "react";
import {
    AlertMarker,
    NoLongerInForceMarker,
    SevereWarningMarker,
    WarningMarker,
    LegendIcon,
    RiverStationIcon, TidalStationIcon, RainfallStationIcon, GroundwaterStationIcon
} from "@/app/ui/map-icons/map-icons";
import {useDispatchContext} from "@/app/hooks/map/map-hook";
import {DetailedFloodAreaWithWarning, FloodWarning, MonitoringStation} from "@/app/services/flood-api-interfaces";
import {Checkbox} from "primereact/checkbox";
import {MeasureType} from "@/app/map-styling/layer-enums";
import {FloodFilters, StationFilters} from "@/app/ui/map/map-interfaces";
import {monitoringStationLayerIdIsVisible} from "@/app/map-styling/layers";
import {MapRef} from "react-map-gl/mapbox";

export default function MapLegend({mapRef, currentFloodsMap}: {
    mapRef: RefObject<MapRef | null>;
    currentFloodsMap: Map<string, DetailedFloodAreaWithWarning>;
    monitoringStationsMap: Map<string, MonitoringStation>;
}) {
    const dispatchContext = useDispatchContext();
    const [isOpen, setIsOpen] = useState(false);
    const [floodFilters, setFloodFilters] = useState({
        filterSevereWarning: true,
        filterFloodWarning: true,
        filterFloodAlert: true,
        filterNoLongerInForce: true
    });
    const [stationFilters, setStationFilters] = useState({
        filterRivers: false,
        filterRainfall: false,
        filterTidal: false,
        filterGroundwater: false
    });

    useEffect(() => {
        const selectedMarkers: number[] = []
        if(floodFilters.filterSevereWarning) {
            selectedMarkers.push(1);
        }
        if(floodFilters.filterFloodWarning) {
            selectedMarkers.push(2);
        }
        if(floodFilters.filterFloodAlert) {
            selectedMarkers.push(3);
        }
        if(floodFilters.filterNoLongerInForce) {
            selectedMarkers.push(4);
        }
        filterMarkers(selectedMarkers);
    }, [floodFilters]);

    useEffect(() => {
        if(mapRef){
            if(mapRef.current?.isStyleLoaded()){
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.UPSTREAM_STAGE, stationFilters.filterRivers);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.UPSTREAM_STAGE + " highlighted", stationFilters.filterRivers);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.DOWNSTEAM_STAGE, stationFilters.filterRivers);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.DOWNSTEAM_STAGE + " highlighted", stationFilters.filterRivers);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.TIDAL_LEVEL, stationFilters.filterTidal);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.TIDAL_LEVEL + " highlighted", stationFilters.filterTidal);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.RAINFALL, stationFilters.filterRainfall);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.RAINFALL + " highlighted", stationFilters.filterRainfall);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.GROUNDWATER, stationFilters.filterGroundwater);
                monitoringStationLayerIdIsVisible(mapRef.current, MeasureType.GROUNDWATER + " highlighted", stationFilters.filterGroundwater);
            }
        }
    }, [stationFilters]);

    const toggleCheckedFloods = (value: number) => {
        switch (value) {
            case 1:
                setFloodFilters((prevState: FloodFilters): FloodFilters => {
                    return {
                        ...prevState,
                        filterSevereWarning: !prevState.filterSevereWarning
                    }
                });
                break;
            case 2:
                setFloodFilters((prevState: FloodFilters): FloodFilters => {
                    return {
                        ...prevState,
                        filterFloodWarning: !prevState.filterFloodWarning
                    }
                });
                break;
            case 3:
                setFloodFilters((prevState: FloodFilters): FloodFilters => {
                    return {
                        ...prevState,
                        filterFloodAlert: !prevState.filterFloodAlert
                    }
                });
                break;
            case 4:
                setFloodFilters((prevState: FloodFilters): FloodFilters => {
                    return {
                        ...prevState,
                        filterNoLongerInForce: !prevState.filterNoLongerInForce
                    }
                });
                break;
        }
    };

    const toggleCheckedStations = (value: number) => {
        switch (value) {
            case 1:
                setStationFilters((prevState: StationFilters): StationFilters => {
                    return {
                        ...prevState,
                        filterRivers: !prevState.filterRivers
                    }
                });
                break;
            case 2:
                setStationFilters((prevState: StationFilters): StationFilters => {
                    return {
                        ...prevState,
                        filterTidal: !prevState.filterTidal
                    }
                });
                break;
            case 3:
                setStationFilters((prevState: StationFilters): StationFilters => {
                    return {
                        ...prevState,
                        filterRainfall: !prevState.filterRainfall
                    }
                });
                break;
            case 4:
                setStationFilters((prevState: StationFilters): StationFilters => {
                    return {
                        ...prevState,
                        filterGroundwater: !prevState.filterGroundwater
                    }
                });
                break;
        }
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

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

    function filterMarkers(filter: number[]) {
        removeMarkers();
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            if(floodAreaWithWarning.currentWarning?.severityLevel) {
                filter.forEach((toBeVisible: number) => {
                    if(floodAreaWithWarning.currentWarning?.severityLevel == toBeVisible){
                        addMarker(floodAreaWithWarning.long, floodAreaWithWarning.lat, floodAreaWithWarning.currentWarning);
                    }
                });
            }
        });
    }

    function removeMarkers() {
        dispatchContext({type: "REMOVE_MARKERS", payload: {}})
    }

    const visibility = isOpen? "max-w-1/6 max-h-1/2 z-100 ml-auto mt-25 bg-amber-200/65 opacity-85 transition-all"
        : "max-w-0 max-h-1/2 z-100 ml-auto mt-25 bg-amber-200/65 opacity-85 transition-all"
    return(
        <div className="overflow-hidden">
            <div className="float-right mt-5 cursor-pointer z-60 opacity-90 bg-gray-500/40">
                <button className="cursor-pointer"
                        onClick={toggleOpen}>
                    <LegendIcon/>
                </button>
            </div>
            <div className={visibility}>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <Checkbox checked={floodFilters.filterSevereWarning} onChange={() => {
                        toggleCheckedFloods(1);
                    }}/>
                    <SevereWarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Severe Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <Checkbox checked={floodFilters.filterFloodWarning} onChange={() => {
                        toggleCheckedFloods(2);
                    }}/>
                    <WarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <Checkbox checked={floodFilters.filterFloodAlert} onChange={() => {
                        toggleCheckedFloods(3);
                    }}/>
                    <AlertMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Alert
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={floodFilters.filterNoLongerInForce} onChange={() => {
                        toggleCheckedFloods(4);
                    }}/>
                    <NoLongerInForceMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Alert/Warning No Longer in Force
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={stationFilters.filterRivers} onChange={() => {
                        toggleCheckedStations(1);
                    }}/>
                    <RiverStationIcon/>
                    <h1 className="h-1/2 text-black font-bold">
                        River Monitoring Stations
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={stationFilters.filterTidal} onChange={() => {
                        toggleCheckedStations(2);
                    }}/>
                    <TidalStationIcon/>
                    <h1 className="h-1/2 text-black font-bold">
                        Tidal Monitoring Stations
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={stationFilters.filterRainfall} onChange={() => {
                        toggleCheckedStations(3);
                    }}/>
                    <RainfallStationIcon/>
                    <h1 className="h-1/2 text-black font-bold">
                        Rainfall Monitoring Stations
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={stationFilters.filterGroundwater} onChange={() => {
                        toggleCheckedStations(4);
                    }}/>
                    <GroundwaterStationIcon/>
                    <h1 className="h-1/2 text-black font-bold">
                        Groundwater Monitoring Stations
                    </h1>
                </div>
                <div className="flex items-center ml-4 mt-3 justify-items-start space-x-13 right-0">
                    <h1 className="h-1/2 text-black font-bold">
                        AOD:
                    </h1>
                    <h1 className="h-1/2 text-black font-bold">
                        Above Ordinance Datum
                    </h1>
                </div>
                <div className="flex items-center ml-4 mt-3 justify-items-start space-x-13 right-0">
                    <h1 className="h-1/2 text-black font-bold">
                        ASD:
                    </h1>
                    <h1 className="h-1/2 text-black font-bold">
                        Above Surface Datum
                    </h1>
                </div>
            </div>
        </div>
    )
}