import React, {useEffect, useRef} from "react";
import { Toast } from "primereact/toast";
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import {ToastData} from "@/app/ui/toast/toast-interface";

const ToastComponent = (props: ToastData) => {
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setTimeout(() => {
            toast.current?.show({
                id: props.toast?.id,
                severity: props.toast?.type,
                summary: props.toast?.heading,
                detail: props.toast?.message,
                content: props.toast?.content,
                life: props.toast?.duration ? props.toast.duration : 5000
            });
        }, 200)
    }, [props.toast]);

    return <Toast ref={toast} />;
};

export default ToastComponent;