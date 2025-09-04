'use client'
import {
    useSelectedFloodWarningDispatchContext,
    useSelectedFloodWarningStateContext
} from "../../hooks/flood/selected-flood-hook"
import {Fragment} from "react";
import Image from "next/image";

export default function SelectedFlood() {
    const {selectedWarning} = useSelectedFloodWarningStateContext();
    const selectedFloodDispatchContext = useSelectedFloodWarningDispatchContext();
    if(selectedWarning) {
        const timeMessageChangedAsDate = new Date(selectedWarning.timeMessageChanged).toUTCString();
        return(
            <aside className="fixed top-0 left-0 z-40 max-w-2/3 2xl:max-w-1/3 xl:max-w-1/3 lg:max-w-1/2 md:max-w-1/2 sm:max-w-1/2
             h-screen mt-35 transition-all"
                   aria-label="Sidebar">
                <div className="h-full px-5 py-5 bg-gray-50 dark:bg-blue-900">
                    <button className="cursor-pointer rounded-full bg-gray-700"
                    onClick={() => {
                        selectedFloodDispatchContext({type: "COLLAPSE_WARNING", payload: {newWarning: undefined}})
                    }}>
                        <Image src="/arrow.png"
                               alt="Collapse Flood Dialog"
                               width={40}
                               height={40}
                        />
                    </button>
                    <div className="h-3/4 px-10 py-8 overflow-auto overscroll-contain bg-gray-50 dark:bg-blue-900">
                        <ul className="space-y-3 lg:space-y-10 m:space-y-5 sm:space-y-3 py-2">
                            <li className="text-center">
                                <span className="flex-wrap items-center rounded-b-sm font-bold underline
                                 text-4xl 2xl:text-6xl xl:text-5xl lg:text-4xl md:text-4xl sm:text-4xl">
                                    {selectedWarning.description}
                                </span>
                            </li>
                            <li>
                                {selectedWarning.severityLevel === 1 &&
                                    <Fragment>
                                        <ul className="space-y-3">
                                            <li className="text-center">
                                                <Image
                                                    className="inline-flex items-center justify-center px-2"
                                                    src={"/flood-severe-warning-icon-960.webp"}
                                                    width={150}
                                                    height={150}
                                                    alt={"Severe Flood Warning Icon"}
                                                />
                                            </li>
                                            <li className="text-center">
                                                <span className="flex-nowrap items-center rounded-b-sm font-bold
                                                text-xl 2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl text-red-800">
                                                    {selectedWarning.severity}
                                                </span>
                                            </li>
                                            <li className="text-center mt-10">
                                                <span className="flex-nowrap items-center font-bold
                                                lg:text-2xl m:text-lg sm:text-m rounded-b-sm">
                                                    Serious risk of death, or injury. Take action immediately.
                                                </span>
                                            </li>
                                        </ul>
                                    </Fragment>
                                }
                                {selectedWarning.severityLevel === 2 &&
                                    <Fragment>
                                        <ul className="space-y-3">
                                            <li className="text-center">
                                                <Image
                                                    className="inline-flex items-center justify-center px-2"
                                                    src={"/flood-warning-icon-960.png"}
                                                    width={150}
                                                    height={150}
                                                    alt={"Flood Warning Icon"}
                                                />
                                            </li>
                                            <li className="text-center">
                                                <span className="flex-nowrap items-center rounded-b-sm font-bold
                                                text-xl 2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl text-red-600">
                                                    {selectedWarning.severity}
                                                </span>
                                            </li>
                                            <li className="text-center mt-10">
                                                <span className="flex-nowrap items-center font-bold
                                                lg:text-2xl m:text-lg sm:text-m rounded-b-sm">
                                                    Flooding will certainly occur. Immediate action should be taken.
                                                </span>
                                            </li>
                                        </ul>
                                    </Fragment>
                                }
                                {selectedWarning.severityLevel === 3 &&
                                    <Fragment>
                                        <ul className="space-y-1">
                                            <li className="text-center">
                                                <Image
                                                    className="inline-flex items-center justify-center px-2"
                                                    src={"/flood-alert-icon-960.png"}
                                                    width={150}
                                                    height={150}
                                                    alt={"Flood Alert Icon"}
                                                />
                                            </li>
                                            <li className="text-center">
                                                <span className="flex-nowrap items-center rounded-b-sm font-bold
                                                text-xl 2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl text-yellow-500">
                                                    {selectedWarning.severity}
                                                </span>
                                            </li>
                                            <li className="text-center mt-10">
                                                <span className="flex-nowrap items-center font-bold
                                                text-lg 2xl:text-2xl xl:text-2xl lg:text-xl md:text-xl sm:text-lg rounded-b-sm">
                                                    Significant risk of flooding in the area. Be vigilant, and prepare to take mitigating steps.
                                                </span>
                                            </li>
                                        </ul>
                                    </Fragment>
                                }
                                {selectedWarning.severityLevel === 4 &&
                                    <Fragment>
                                        <ul className="space-y-1">
                                            <li className="text-center">
                                                <Image
                                                    className="inline-flex items-center justify-center px-2"
                                                    src={"/info-icon-512x512-yqsopuso.png"}
                                                    width={100}
                                                    height={100}
                                                    alt={"Warning no longer in force icon"}
                                                />
                                            </li>
                                            <li className="text-center">
                                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold
                                                2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl text-blue-400">
                                                    {selectedWarning.severity}
                                                </span>
                                            </li>
                                            <li className="text-center mt-10">
                                                <span className="flex-nowrap items-center sm:justify-start font-bold
                                                lg:text-2xl m:text-lg sm:text-m @xs:text-sm rounded-b-sm">
                                                    No longer any significant risk of flooding. Remain vigilant, but no action is necessary.
                                                </span>
                                            </li>
                                        </ul>
                                    </Fragment>
                                }
                            </li>
                        </ul>
                        <ul className="space-y-3 py-5">
                            <li className="text-xl text-center">
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold
                                lg:text-2xl m:text-lg sm:text-m">
                                    Affected Area:
                                </span>
                            </li>
                            <li className="text-2xl text-center">
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm underline
                                lg:text-2xl m:text-lg sm:text-m">
                                    {selectedWarning.eaAreaName}
                                </span>
                            </li>
                        </ul>
                        <ul className="space-y-3 mt-5">
                            <li className="text-lg">
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold
                                text-lg 2xl:text-2xl xl:text-2xl lg:text-2xl m:text-xl sm:text-lg">
                                    Message:
                                </span>
                            </li>
                            <li>
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm
                                text-lg 2xl:text-2xl xl:text-2xl lg:text-2xl m:text-xl sm:text-lg">
                                    {selectedWarning.message}
                                </span>
                            </li>
                            <li>
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold
                                 text-m lg:text-2xl m:text-lg sm:text-m">
                                    Message last updated on:
                                </span>
                            </li>
                            <li>
                                <span className="flex-nowrap items-center sm:justify-start rounded-b-sm
                                lg:text-2xl m:text-lg sm:text-m @xs:text-sm">
                                    {timeMessageChangedAsDate}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        );
    }
}