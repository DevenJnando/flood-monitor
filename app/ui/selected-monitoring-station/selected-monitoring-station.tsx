'use client'
import {
    useSelectedMonStnDispatchContext,
    useSelectedMonStnStateContext
} from "@/app/hooks/monitoring-station/selected-monitoring-station-hook"
import {Fragment, Key} from "react";
import Image from "next/image";
import {Measure} from "@/app/services/flood-api-interfaces";
import {MeasureType} from "@/app/map-styling/layer-enums";

export default function SelectedMonitoringStation() {
    const {selectedStation} = useSelectedMonStnStateContext();
    const selectedMonStnDispatchContext = useSelectedMonStnDispatchContext();
    if (selectedStation) {
        return (
            <aside className="fixed bottom-0 left-1/3 z-40 max-h-1000 w-screen transition-transform -translate-y-full sm:translate-y-0"
                   aria-label="StationBar">
                <div className="px-3 py-4 overflow-x-auto bg-gray-50 dark:bg-gray-200 opacity-70">
                    <button className="cursor-pointer rounded-full bg-gray-700"
                            onClick={() => {
                                selectedMonStnDispatchContext({type: "COLLAPSE_STATION", payload: {newStation: undefined}})
                            }}>
                        <Image src="/arrow.png"
                               alt="Collapse Flood Dialog"
                               width={40}
                               height={40}
                        />
                    </button>
                    <ul className="space-y-5 p-5">
                        {selectedStation.label &&
                            <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm text-3xl text-black font-bold">
                                Station: {selectedStation.label}
                            </span>
                            </li>
                        }
                        {selectedStation.catchmentName &&
                            <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm text-3xl text-black font-bold">
                                Catchment: {selectedStation.catchmentName}
                            </span>
                            </li>
                        }
                        {selectedStation.riverName &&
                            <li>
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm text-3xl text-black font-bold">
                                    River Name: {selectedStation.riverName}
                                </span>
                            </li>
                        }

                        {selectedStation.measures.map((measure: (Measure | undefined), i: Key | null | undefined) => (
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-2xl  text-black" key={i}>
                                {measure?.qualifier === MeasureType.UPSTREAM_STAGE && measure.latestReading?.value != undefined &&
                                        <li>
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold underline text-2xl  text-black">
                                                Upstream River Measuring Station
                                            </span>
                                            <Image
                                                className="inline-flex items-center justify-center px-2"
                                                src={"/river-system.png"}
                                                width={75}
                                                height={75}
                                                alt={"River icon"}
                                            />
                                        </li>
                                }
                                {measure?.qualifier === MeasureType.DOWNSTEAM_STAGE && measure.latestReading?.value != undefined &&
                                    <li>
                                        <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold underline text-2xl  text-black">
                                            Downstream River Measuring Station
                                        </span>
                                        <Image
                                            className="inline-flex items-center justify-center px-2"
                                            src={"/river-system.png"}
                                            width={75}
                                            height={75}
                                            alt={"River icon"}
                                        />
                                    </li>
                                }
                                {measure?.qualifier === MeasureType.TIDAL_LEVEL && measure.latestReading?.value != undefined &&
                                    <li>
                                        <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold underline text-2xl  text-black">
                                            Tidal/Coastal Measuring Station
                                        </span>
                                        <Image
                                            className="inline-flex items-center justify-center px-2"
                                            src={"/river-and-lake-flow-monitoring-points.png"}
                                            width={75}
                                            height={75}
                                            alt={"Tidal icon"}
                                        />
                                    </li>
                                }
                                {measure?.qualifier === MeasureType.RAINFALL && measure.latestReading?.value != undefined &&
                                    <li>
                                        <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold underline text-2xl  text-black">
                                            Rainfall Measuring Station
                                        </span>
                                        <Image
                                            className="inline-flex items-center justify-center px-2"
                                            src={"/light-rain-83.png"}
                                            width={75}
                                            height={75}
                                            alt={"Rainfall icon"}
                                        />
                                    </li>
                                }
                                {measure?.qualifier === MeasureType.GROUNDWATER && measure.latestReading?.value != undefined &&
                                    <li>
                                        <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold underline text-2xl  text-black">
                                            Groundwater Measuring Station
                                        </span>
                                        <Image
                                            className="inline-flex items-center justify-center px-2"
                                            src={"/groundwater-source.png"}
                                            width={75}
                                            height={75}
                                            alt={"Groundwater icon"}
                                        />
                                    </li>
                                }
                                {measure?.latestReading?.value != undefined &&
                                    <span className="flex-nowrap items-center sm:justify-start rounded-b-sm text-2xl text-black font-bold">
                                        {measure?.parameterName}: {measure?.latestReading?.value}{measure?.unitName}
                                    </span>
                                }
                            </span>
                        ))}
                    </ul>
                </div>
            </aside>
        );
    }
}