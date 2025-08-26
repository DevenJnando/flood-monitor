'use client'

import {redirect} from "next/navigation";
import {useEffect} from "react";


function backToHome() {
    setTimeout(()=> {
        redirect(`/`);
    }, 5000)
}


export default function Unsubscribe({res}: {
    res: {message: string}
}) {

    useEffect(() => {
        backToHome()
    }, [])

    return (
        <div className="flex items-center justify-center w-full h-full px-4 mx-auto mt-50 text-base text-center
                text-gray-500 dark:text-gray-400">
            <p>{res.message}</p>
        </div>
    )
}