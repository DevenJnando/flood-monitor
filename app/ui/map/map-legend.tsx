"use client"
import {useEffect, useState} from "react";
import {AlertMarker, NoLongerInForceMarker, SevereWarningMarker, WarningMarker, LegendIcon} from "@/app/ui/map-icons/map-icons";
import {useDispatchContext} from "@/app/hooks/map/map-hook";
import {DetailedFloodAreaWithWarning, FloodWarning, MonitoringStation} from "@/app/services/flood-api-interfaces";
import {Input} from "postcss";
import {Checkbox} from "primereact/checkbox";

export default function MapLegend({currentFloodsMap, monitoringStationsMap}: {
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

    useEffect(() => {
        const selectedMarkers = []
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

    const toggleChecked = (value: number) => {
        switch (value) {
            case 1:
                setFloodFilters((prevState) => {
                    return {
                        ...prevState,
                        filterSevereWarning: !prevState.filterSevereWarning
                    }
                });
                break;
            case 2:
                setFloodFilters((prevState) => {
                    return {
                        ...prevState,
                        filterFloodWarning: !prevState.filterFloodWarning
                    }
                });
                break;
            case 3:
                setFloodFilters((prevState) => {
                    return {
                        ...prevState,
                        filterFloodAlert: !prevState.filterFloodAlert
                    }
                });
                break;
            case 4:
                setFloodFilters((prevState) => {
                    return {
                        ...prevState,
                        filterNoLongerInForce: !prevState.filterNoLongerInForce
                    }
                });
                break;
        }
    };
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
        console.log(filter);
        Array.from(currentFloodsMap.values()).map((floodAreaWithWarning: DetailedFloodAreaWithWarning) => {
            console.log(floodAreaWithWarning.currentWarning?.severityLevel)
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
                        toggleChecked(1);
                    }}/>
                    <SevereWarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Severe Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <Checkbox checked={floodFilters.filterFloodWarning} onChange={() => {
                        toggleChecked(2)
                    }}/>
                    <WarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <Checkbox checked={floodFilters.filterFloodAlert} onChange={() => {
                        toggleChecked(3)
                    }}/>
                    <AlertMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Alert
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-13 right-0">
                    <Checkbox checked={floodFilters.filterNoLongerInForce} onChange={() => {
                        toggleChecked(4)
                    }}/>
                    <NoLongerInForceMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Alert/Warning No Longer in Force
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