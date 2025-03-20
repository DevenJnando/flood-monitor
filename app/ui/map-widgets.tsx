import {Marker} from "react-map-gl/mapbox";
import {Layer} from "react-map-gl/mapbox";
import {Source} from "react-map-gl/mapbox";
import {useStateContext} from "@/app/hooks/map-hook";
import {useSelectedFloodWarningDispatchContext} from "@/app/hooks/selected-flood-hook";
import {Fragment} from "react";
import Image from "next/image";

export const Markers = () => {
    const { markers } = useStateContext();
    const selectedFloodDispatchContext = useSelectedFloodWarningDispatchContext();
    return(
        <Fragment>
            {markers.map((marker, i) => (
                <Marker
                    key={i}
                    onClick={() => {
                        selectedFloodDispatchContext({type: "SELECT_WARNING",
                        payload: {newWarning: marker.warning}});
                    }}
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
                    {marker.severityLevel === 4 &&
                        <Image src={"/info-icon-512x512-yqsopuso.png"}
                               width={30}
                               height={30}
                               alt={"Flood Warning No Longer in Force Marker"}/>
                    }
                </Marker>
            ))}
        </Fragment>
    )
}

export const Layers = () => {
    const { layers } = useStateContext();
    return (
        <Fragment>
            {layers.map((layer, i) => (
                <Fragment key={i}>
                    <Layer
                        key={i}
                        id={layer.id}
                        type={layer.type}
                        source={layer.source}
                        layout={{}}
                        paint={layer.paint}
                    >
                    </Layer>
                </Fragment>
            ))}
        </Fragment>
    )
}

export const Sources = () => {
    const { sources } = useStateContext();
    return (
        <Fragment>
            {sources.map((source, i) => (
                <Source
                    key={i}
                    type="geojson"
                    id={source.id}
                    data={source.data}
                >

                </Source>
            ))}
        </Fragment>
    )
}