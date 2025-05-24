import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import {ToastData} from "@/app/ui/toast/toast-interface";

const ToastComponent = (props: ToastData) => {
    const toast = useRef<Toast>(null);

    useEffect(() => {
        toast.current?.show({
            severity: props.toast?.type,
            summary: props.toast?.heading,
            detail: props.toast?.message,
            life: props.toast?.duration ? props.toast.duration : 5000,
        });
    }, [props.toast]);

    return <Toast baseZIndex={100} ref={toast} />;
};

export default ToastComponent;