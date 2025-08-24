import * as React from 'react'
import Link from "next/link";


export default function Navbar(){
    return (
        <div className="flex items-center justify-center bg-white border-b dark:bg-gray-900
        dark:border-gray-700 fixed w-full top-0 z-50 left-0">
            <div className="container p-4 mx-auto">
                <h1 className="text-4xl font-semibold">
                    Flood Warning Services
                </h1>
                <div className="flex items-center mt-5 bg-gray-500 rounded-bl-full">
                    <Link className="mt-2 ml-10 medium text-blue-900 hover:text-blue-400
                    text-lg rounded-b-sm font-bold" href={`/`}>
                        Live Map
                    </Link>
                    <Link className="mt-2 ml-10 medium text-blue-900 hover:text-blue-400
                    text-lg rounded-b-sm font-bold" href={`/notifications`}>
                        Notifications
                    </Link>
                </div>
                <aside className="flex items-center">
                    <p className="text-white mt-2 text-xs">this uses Environment Agency flood and river level data from the real-time data API (Beta)</p>
                </aside>
            </div>
        </div>
    )
}