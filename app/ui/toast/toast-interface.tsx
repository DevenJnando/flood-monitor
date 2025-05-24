export type ToastType = {
    heading: string;
    message: string;
    type?: "error" | "success" | "info" | "warn"
    duration?: number;
}
export type ToastData = {
    toast:ToastType | undefined
}

export interface ToastTypeInterface {
    success: ({heading, message, duration}: ToastType) => void
    warning: ({heading, message, duration}: ToastType) => void
    info: ({heading, message, duration}: ToastType) => void
    error: ({heading, message, duration}: ToastType) => void
}