'use client'

import * as React from "react";
import Navbar from "@/app/ui/navbar/navbar"
import {addSubscriber} from "@/app/notifications/form-action";
import {useActionState} from "react";


const initialState = {
    error: false,
    message: '',
}

export default function NotificationsPage() {


    const [state, formAction, pending] = useActionState(addSubscriber, initialState)
    return (
        <div className="font-[family-name:var(--font-lato)]">
            <main className="grid content-start">
                <Navbar></Navbar>
                <div className="flex items-center justify-center max-w-2xl px-4 mx-auto mt-50 text-base text-center
                text-gray-500 dark:text-gray-400">
                    <h1 className="text-4xl font-semibold">
                        Flood Warning Notification Service
                    </h1>
                </div>
                <form className="max-w-6xl px-4 mx-auto mt-10 text-base text-center text-gray-500 dark:text-gray-400
                md:text-xl"
                      action={formAction}>
                    <label className="shrink" htmlFor="email">Email</label>
                    <div className="mt-2 shrink">
                        <input className="w-100 h-8 bg-gray-500 shrink text-black font-semibold"
                               type="text" id="email" name="email" required />
                    </div>

                    <div className="mt-10">
                        <label className="shrink" htmlFor="postcode">Postcode(s)</label>
                    </div>
                    <div className="mt-2">
                        <input className="w-100 h-8 bg-gray-500 shrink text-black font-semibold"
                               type="postcode" id="postcode" name="postcode" required />
                    </div>
                    <div className="mt-5">
                        <button className="bg-blue-500 hover:bg-blue-700 shrink text-black font-bold py-2 px-4 rounded-full"
                                type="submit">Get Notifications</button>
                        {state?.message && state?.error &&
                            <p className="text-red-700 shrink" aria-live="polite">
                                {state.message}
                            </p>
                        }
                        {state?.message && !state?.error &&
                            <p className="text-green-500 shrink" aria-live="polite">
                                {state.message}
                            </p>}
                    </div>
                </form>
                <p className="max-w-6xl shrink px-4 mx-auto mt-10 text-base text-center text-gray-500
                dark:text-gray-400 md:text-xl">
                    Enter your email address and postcode above to be alerted whenever your area is at risk of flooding
                </p>
                <p className="max-w-6xl shrink px-4 mx-auto mt-10 text-base text-center text-gray-500
                dark:text-gray-400 md:text-xl">
                    (Hint: If you have multiple postcodes you want to associate with an email, you can do so by separating each
                    postcode with a comma. Like this: A11A11, B22B22)
                </p>
            </main>
        </div>
    )
}