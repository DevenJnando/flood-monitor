import {useEffect, useState} from "react";

export function getHostName() {
    switch (process.env.NEXT_PUBLIC_BUILD) {
        case "dev":
            return window.location.hostname + ":" + process.env.NEXT_PUBLIC_PORT;
        case "prod":
            return window.location.hostname;
        default:
            return "";
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