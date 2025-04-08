import {useEffect, useState} from "react";
import {LayerType} from "@/app/ui/map-interfaces";

export function layerIsVisible(layer: LayerType | undefined, isVisible: boolean) {
    if(layer){
        if(Object.hasOwn(layer, "layout")) {
            // @ts-ignore
            layer["layout"] = isVisible? {visibility: "visible"} : {visibility: "none"};
            return layer;
        }
    }
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}