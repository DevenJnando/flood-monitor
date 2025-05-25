import React from "react";
import {ContentProps} from "primereact/toast";

export type ToastType = {
    id: string;
    heading: string;
    message: string;
    type?: "error" | "success" | "info" | "warn";
    duration?: number;
    content?: React.ReactNode | ((props: ContentProps) => React.ReactNode)
}
export type ToastData = {
    toast:ToastType | undefined
}

export interface ToastTypeInterface {
    success: ({heading, message, duration}: ToastType) => void
    successWithContent: ({heading, message, duration, content}: ToastType) => void
    warning: ({heading, message, duration}: ToastType) => void
    warningWithContent: ({heading, message, duration, content}: ToastType) => void
    info: ({heading, message, duration}: ToastType) => void
    infoWithContent: ({heading, message, duration, content}: ToastType) => void
    error: ({heading, message, duration}: ToastType) => void
    errorWithContent: ({heading, message, duration, content}: ToastType) => void
}