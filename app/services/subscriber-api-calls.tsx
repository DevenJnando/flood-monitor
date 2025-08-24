'use server'
import {CONSTANTS} from "@/app/constants/constants";


export async function postNewSubscriber(subscriber_email: string, subscriber_postcodes: string[]):
    Promise<{error: boolean, message: string}> {
    const formToSend = new FormData()
    formToSend.append("email", subscriber_email)
    for(let i = 0; i < subscriber_postcodes.length; i++) {
        formToSend.append("postcodes", subscriber_postcodes[i])
    }
    try {
        const res = await fetch(process.env.SUBSCRIBER_ENDPOINT + "/subscribers/add", {
            method: 'POST',
            body: formToSend
        })
        const statusCode = res.status
        switch (statusCode) {
            case CONSTANTS.CREATED:
                return {
                    error: false,
                    message: "Success! We will notify you of any floods in your area!"
                }
            case CONSTANTS.NOT_ACCEPTABLE:
                return {
                    error: true,
                    message: "Not a valid email! Please try again."
                }
            case CONSTANTS.CONFLICT:
                return {
                    error: true,
                    message: "Email address already exists! Please try again."
                }
            case CONSTANTS.NO_CONTENT:
                return {
                    error: true,
                    message: "Postcode area code is monitored, but no postcode under the given district could be found. \n" +
                        "Please check that your postcode is correct, and try again."
                }
            case CONSTANTS.NOT_FOUND:
                return {
                    error: true,
                    message: "Postcode area is not monitored by this service...I'm sorry! \n" +
                        "Currently, Scotland, Northern Ireland and Wales are not covered by this service. \n" +
                        "There are multiple reasons for this, most of them to do with government funding, \n" +
                        "and bureaucratic red tape. \n" +
                        "Blame your local government, and/or Westminster. Don't blame me, please!"
                }
            default:
                return {
                    error: true,
                    message: "An unknown error has occurred..."
                }
        }
    }
    catch (error) {
        console.error(error)
        return {
            error: true,
            message: "An unknown error has occurred..."
        }
    }

}