import Image from "next/image";


export function SevereWarningMarker() {
    return (
        <Image src={"/flood-severe-warning-icon-960.webp"}
                   width={60}
                   height={60}
                   alt={"Severe Flood Warning Marker"}/>
    );
}

export function WarningMarker() {
    return (
        <Image src={"/flood-warning-icon-960.png"}
               width={60}
               height={60}
               alt={"Flood Warning Marker"}/>
    );
}

export function AlertMarker() {
    return(
        <Image src={"/flood-alert-icon-960.png"}
               width={60}
               height={60}
               alt={"Flood Alert Marker"}/>
    );
}

export function NoLongerInForceMarker() {
    return (
        <Image src={"/info-icon-512x512-yqsopuso.png"}
               width={30}
               height={30}
               alt={"Flood Warning No Longer in Force Marker"}/>
    );
}

export function RiverStationIcon() {
    return (
        <Image src={"/river-system.png"}
               width={30}
               height={30}
               alt={"Flood Warning No Longer in Force Marker"}/>
    );
}

export function RainfallStationIcon() {
    return (
        <Image src={"/light-rain-83.png"}
               width={30}
               height={30}
               alt={"Flood Warning No Longer in Force Marker"}/>
    );
}

export function TidalStationIcon() {
    return (
        <Image src={"/river-and-lake-flow-monitoring-points.png"}
               width={30}
               height={30}
               alt={"Flood Warning No Longer in Force Marker"}/>
    );
}

export function GroundwaterStationIcon() {
    return (
        <Image src={"/groundwater-source.png"}
               width={30}
               height={30}
               alt={"Flood Warning No Longer in Force Marker"}/>
    );
}

export function LegendIcon() {
    return (
        <Image src="/legend-toggle.svg"
               alt="Toggle Legend"
               width={40}
               height={40}
        />
    )
}