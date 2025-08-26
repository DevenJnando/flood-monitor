import {redirect} from 'next/navigation'
import {unsubscribe} from "@/app/services/subscriber-api-calls";
import Unsubscribe from "@/app/notifications/unsubscribe/unsubscribe";


export default async function UnsubscribePage(
    {
        searchParams,
    }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }) {
    const params = await searchParams
    let id = params.id
    if(id){
        if(typeof(id) != "string"){
            id = ""
        }
    }
    const idToBeDeleted = id
    if(!idToBeDeleted){
        redirect(`/`)
    }
    const res = await unsubscribe(idToBeDeleted)
    return (
        <Unsubscribe res={res}/>
    )
}