'use server'
import {CONSTANTS} from "@/app/constants/constants";


export async function postNewSubscriber(subscriberEmail: string, subscriberPostcodes: string[]):
    Promise<{error: boolean, message: string}> {
    const formToSend = new FormData()
    formToSend.append("email", subscriberEmail)
    for(let i = 0; i < subscriberPostcodes.length; i++) {
        formToSend.append("postcodes", subscriberPostcodes[i])
    }
    const ATTEMPT_LIMIT = 5
    let attempt = 1
    while(attempt < ATTEMPT_LIMIT) {
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
                    console.error("Fetch request failed. Retrying...(attempt " + attempt + " of " + ATTEMPT_LIMIT + ")")
                    attempt += 1
                    await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.error(error)
            console.error("Fetch request failed. Retrying...(attempt " + attempt + " of " + ATTEMPT_LIMIT + ")")
            attempt += 1
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    }
    return {
        error: true,
        message: "Attempt limit reached. Database may be down, or inaccessible."
    }

}


export async function unsubscribe(subscriberID: string): Promise<{message: string}>{
    const ATTEMPT_LIMIT = 5
    let attempt = 1
    while(attempt < ATTEMPT_LIMIT) {
        try {
            const res = await fetch(process.env.SUBSCRIBER_ENDPOINT + "/subscribers/delete/" + subscriberID, {
                method: 'DELETE'
            })
            const statusCode = res.status
            switch (statusCode) {
                case CONSTANTS.NO_CONTENT:
                    return {
                        message: "You have unsubscribed from the notifications mailing list successfully. Redirecting..."
                    }
                case CONSTANTS.NOT_FOUND:
                    return {
                        message: "No user with given ID present in the database. Redirecting..."
                    }
                default:
                    console.error("Fetch request failed. Retrying...(attempt " + attempt + " of " + ATTEMPT_LIMIT + ")")
                    attempt += 1
                    await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.error(error)
            console.error("Fetch request failed. Retrying...(attempt " + attempt + " of " + ATTEMPT_LIMIT + ")")
            attempt += 1
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    }
    return {
        message: "Attempt limit reached. Database may be down, or inaccessible. Redirecting..."
    }
}