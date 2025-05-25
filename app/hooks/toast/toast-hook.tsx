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

    const success = ({id, heading, message, duration}:ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, type: "success"}
        toastMessage(toastData)
    };

    const successWithContent = ({id, heading, message, duration, content}: ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, content, type: "success"};
        toastMessage(toastData);
    }

    const warning = ({id, heading, message, duration}:ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, type: "warn"}
        toastMessage(toastData)
    };

    const warningWithContent = ({id, heading, message, duration, content}: ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, content, type: "warn"};
        toastMessage(toastData);
    }

    const info = ({id, heading, message, duration}:ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, type: "info"}
        toastMessage(toastData)
    };

    const infoWithContent = ({id, heading, message, duration, content}: ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, content, type: "info"};
        toastMessage(toastData);
    }

    const error = ({id, heading, message, duration}:ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, type: "error"}
        toastMessage(toastData)
    };

    const errorWithContent = ({id, heading, message, duration, content}: ToastType) => {
        const toastData: ToastType = {id, heading, message, duration, content, type: "error"};
        toastMessage(toastData);
    }

    const value: ToastTypeInterface = {success, successWithContent, warning, warningWithContent, info, infoWithContent, error, errorWithContent}

    return (
        <toastContext.Provider value={value}>
            <ToastComponent toast={toastData}/>
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