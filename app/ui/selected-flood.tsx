'use client'
import {
    useSelectedFloodWarningDispatchContext,
    useSelectedFloodWarningStateContext
} from "@/app/hooks/selected-flood-hook"
import {Fragment} from "react";
import Image from "next/image";

export default function SelectedFlood() {
    const {selectedWarning} = useSelectedFloodWarningStateContext();
    const selectedFloodDispatchContext = useSelectedFloodWarningDispatchContext();
    if(selectedWarning) {
        const timeMessageChangedAsDate = new Date(selectedWarning.timeMessageChanged).toUTCString();
        return(
            <aside className="fixed top-0 left-0 z-40 max-w-1/3 h-screen transition-transform -translate-x-full sm:translate-x-0"
                   aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-blue-900">
                    <button className="cursor-pointer rounded-full bg-gray-700"
                    onClick={() => {
                        selectedFloodDispatchContext({type: "COLLAPSE_WARNING"})
                    }}>
                        <Image src="/arrow.png"
                               alt="Collapse Flood Dialog"
                               width={40}
                               height={40}
                        />
                    </button>
                    <ul className="space-y-10 p-5">
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm text-3xl font-bold underline">
                                {selectedWarning.description}
                            </span>
                        </li>
                        <li>
                            {selectedWarning.severityLevel === 1 &&
                                <Fragment>
                                    <ul className="space-y-3">
                                        <li>
                                            <Image
                                                className="inline-flex items-center justify-center px-2"
                                                src={"/flood-severe-warning-icon-960.webp"}
                                                width={100}
                                                height={100}
                                                alt={"Severe Flood Warning Icon"}
                                            />
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-2xl  text-red-800">
                                                {selectedWarning.severity}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                                Serious risk of death, or injury. Take action immediately.
                                            </span>
                                        </li>
                                    </ul>
                                </Fragment>
                            }
                            {selectedWarning.severityLevel === 2 &&
                                <Fragment>
                                    <ul className="space-y-3">
                                        <li>
                                            <Image
                                                className="inline-flex items-center justify-center px-2"
                                                src={"/flood-warning-icon-960.png"}
                                                width={100}
                                                height={100}
                                                alt={"Flood Warning Icon"}
                                            />
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-2xl  text-red-600">
                                                {selectedWarning.severity}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                                Flooding will certainly occur. Immediate action should be taken.
                                            </span>
                                        </li>
                                    </ul>
                                </Fragment>
                            }
                            {selectedWarning.severityLevel === 3 &&
                                <Fragment>
                                    <ul className="space-y-3">
                                        <li>
                                            <Image
                                                className="inline-flex items-center justify-center px-2"
                                                src={"/flood-alert-icon-960.png"}
                                                width={100}
                                                height={100}
                                                alt={"Flood Alert Icon"}
                                            />
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-2xl text-yellow-500">
                                                {selectedWarning.severity}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                                Significant risk of flooding in the area. Be vigilant, and prepare to take mitigating steps.
                                            </span>
                                        </li>
                                    </ul>
                                </Fragment>
                            }
                            {selectedWarning.severityLevel === 4 &&
                                <Fragment>
                                    <ul className="space-y-3">
                                        <li>
                                            <Image
                                                className="inline-flex items-center justify-center px-2"
                                                src={"/info-icon-512x512-yqsopuso.png"}
                                                width={100}
                                                height={100}
                                                alt={"Warning no longer in force icon"}
                                            />
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-2xl text-blue-400">
                                                {selectedWarning.severity}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                                No longer any significant risk of flooding. Remain vigilant, but no action is necessary.
                                            </span>
                                        </li>
                                    </ul>
                                </Fragment>
                            }
                        </li>
                    </ul>
                    <ul className="space-y-3 p-5">
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-lg">
                                Affected Area:
                            </span>
                        </li>
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                {selectedWarning.eaAreaName}
                            </span>
                        </li>
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-lg">
                                Message:
                            </span>
                        </li>
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                {selectedWarning.message}
                            </span>
                        </li>
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm font-bold text-lg">
                                Message last updated on:
                            </span>
                        </li>
                        <li>
                            <span className="flex-nowrap items-center sm:justify-start rounded-b-sm">
                                {timeMessageChangedAsDate}
                            </span>
                        </li>
                    </ul>
                </div>
            </aside>
        );
    }
}