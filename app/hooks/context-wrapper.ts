import {Context, useContext} from "react";

export const useContextWrapper = (contextToUse: Context<any>) => {
    const context = useContext(contextToUse);
    if(!context) {
        throw new Error("Context may have been requested outside of Provider.");
    }
    return context;
}