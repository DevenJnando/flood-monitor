'use client'
import {createContext, PropsWithChildren, useContext, useState} from "react";
import {ToastType, ToastTypeInterface} from "@/app/ui/toast/toast-interface";
import ToastComponent from "@/app/ui/toast/toast-component";

export const toastContext = createContext<ToastTypeInterface | undefined>(undefined);


export function ToastProvider({children}: PropsWithChildren) {

    const [toastData, setToastData] = useState<ToastType>();
    const toastMessage = (data:ToastType) =>{
        setToastData({
            ...data
        })
    }

    const success = ({heading,message, duration}:ToastType) => {
        const toastData:ToastType = {heading,message, duration, type:"success"}
        toastMessage(toastData)
    };

    const warning = ({heading,message, duration}:ToastType) => {
        const toastData:ToastType = {heading,message, duration, type:"warn"}
        toastMessage(toastData)
    };

    const info = ({heading,message, duration}:ToastType) => {
        const toastData:ToastType = {heading,message, duration, type:"info"}
        toastMessage(toastData)
    };

    const error = ({heading,message, duration}:ToastType) => {
        const toastData:ToastType = {heading,message, duration, type:"error"}
        toastMessage(toastData)
    };

    const value:ToastTypeInterface = {success, warning, info, error}

    return (
        <toastContext.Provider value={value}>
            {toastData && <ToastComponent toast={toastData}/>}
            {children}
        </toastContext.Provider>
    )
}

export function useToastContext() {
    const context = useContext(toastContext);
    if(!context){
        throw new Error('useToastContext must be used within an ToastProvider');
    }
    return context;
}