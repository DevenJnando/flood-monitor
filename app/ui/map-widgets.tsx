import {Marker} from "react-map-gl/mapbox";
import {useStateContext} from "@/app/hooks/map-hook";
import {Fragment} from "react";
import Image from "next/image";

export const Markers = () => {
    const { markers } = useStateContext();
    return(
        <Fragment>
            {markers.map((marker, i) => (
                <Marker
                    key={i}
                    latitude={marker.lat}
                    longitude={marker.long}>
                    {marker.severityLevel === 1 &&
                        <Image src={"/flood-severe-warning-icon-960.webp"}
                               width={60}
                               height={60}
                               alt={"Severe Flood Warning Marker"}/>
                    }
                    {marker.severityLevel === 2 &&
                        <Image src={"/flood-warning-icon-960.png"}
                               width={60}
                               height={60}
                               alt={"Flood Warning Marker"}/>
                    }
                    {marker.severityLevel === 3 &&
                        <Image src={"/flood-alert-icon-960.png"}
                               width={60}
                               height={60}
                               alt={"Flood Alert Marker"}/>
                    }
                </Marker>
            ))}
        </Fragment>
    )
}