'use server'
import {z} from 'zod'
import {postNewSubscriber} from "@/app/services/subscriber-api-calls";


function joinPostcodes(formData: FormData): string[] {
    const postcodes: string[] | undefined = []
    const postcode: string | undefined = formData.get('postcode')?.toString()
    if(postcode !== undefined) {
        if(!postcode.includes(",")) {
            postcodes.push(postcode)
        } else {
            const commaSeparatedPostcodes = postcode.split(", ")
            if (commaSeparatedPostcodes.length == 1) {
                commaSeparatedPostcodes.pop()
                commaSeparatedPostcodes.push(...postcode.split(","))
            }
            postcodes.push(...commaSeparatedPostcodes)
        }
    }
    return postcodes
}


const subscriberSchema = z.object(
    {
        email: z.email({
            error: "Invalid email"
        }),
        postcodes: z.array(z.string().max(8)).max(5)
    }
)

export async function addSubscriber(prevState: {error: boolean, message: string}, formData: FormData) {
    const email = formData.get('email')?.toString()
    const postcodes: string[] | undefined = joinPostcodes(formData)
    const validatedFields = subscriberSchema.safeParse({
        email: formData.get('email'),
        postcodes: postcodes,
    })
    if (!validatedFields.success) {
        const errorTree = z.treeifyError(validatedFields.error)
        let emailErrors = ""
        let postcodeErrors = ""
        errorTree.properties?.email?.errors.forEach(error => {
            emailErrors = emailErrors.concat(error + "\n")
        })
        errorTree.properties?.postcodes?.items?.forEach(errorMap => {
            errorMap.errors.forEach(error => {
                postcodeErrors = postcodeErrors.concat(error + "\n")
            })
        })
        const allErrors = emailErrors.concat(postcodeErrors)
        return {
            error: true,
            message: allErrors,
        }
    }
    if(email !== undefined) {
        const res = await postNewSubscriber(email, postcodes)
        return res
    }
    return {
        error: true,
        message: "An unknown error has occurred..."
    }
}