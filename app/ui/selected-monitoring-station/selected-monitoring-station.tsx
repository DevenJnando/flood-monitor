'use client'
import {
    useSelectedMonStnDispatchContext,
    useSelectedMonStnStateContext
} from "@/app/hooks/monitoring-station/selected-monitoring-station-hook"
import {Fragment} from "react";
import Image from "next/image";

export default function SelectedMonitoringStation() {
    const {selectedStation} = useSelectedMonStnStateContext();
    const selectedMonStnDispatchContext = useSelectedMonStnDispatchContext();
    if (selectedStation) {
        return (
            <aside className="fixed top-0 left-0 z-40 max-h-1/3 w-screen transition-transform -translate-y-full sm:translate-y-0"
                   aria-label="StationBar">
            </aside>
        );
    }
}