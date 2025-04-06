"use client"
import {useState} from "react";
import {AlertMarker, NoLongerInForceMarker, SevereWarningMarker, WarningMarker, LegendIcon} from "@/app/ui/map-icons";

export default function MapLegend() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const visibility = isOpen? "max-w-1/6 max-h-1/2 z-30 ml-auto mt-100 bg-amber-200 opacity-85 transition-all"
        : "max-w-0 max-h-1/2 z-30 ml-auto mt-100 bg-amber-200 opacity-85 transition-all"
    return(
        <div className="overflow-hidden">
            <div className="float-right mt-5 cursor-pointer z-60 opacity-70 bg-gray-500">
                <button className="cursor-pointer"
                        onClick={toggleOpen}>
                    <LegendIcon/>
                </button>
            </div>
            <div className={visibility}>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <SevereWarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Severe Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <WarningMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Warning
                    </h1>
                </div>
                <div className="flex items-center justify-items-start space-x-10 right-0">
                    <AlertMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Flood Alert
                    </h1>
                </div>
                <div className="flex items-center ml-4 mt-3 justify-items-start space-x-13 right-0">
                    <NoLongerInForceMarker/>
                    <h1 className="h-1/2 text-black font-bold">
                        Alert/Warning No Longer in Force
                    </h1>
                </div>
            </div>
        </div>
    )
}