import {Marker} from "react-map-gl/mapbox";
import {Layer} from "react-map-gl/mapbox";
import {Source} from "react-map-gl/mapbox";
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
                    {layer.severityLevel === 1 &&
                            <Layer
                                key={i}
                                id={layer.id}
                                type={layer.type}
                                source={layer.source}
                                layout={{}}
                                paint={{
                                    'line-color': '#720101',
                                    'line-width': 3
                                }}
                            >
                            </Layer>
                    }
                    {layer.severityLevel === 2 &&
                        <Layer
                            key={i}
                            id={layer.id}
                            type={layer.type}
                            source={layer.source}
                            layout={{}}
                            paint={{
                                'line-color': '#f80a0a',
                                'line-width': 3
                            }}
                        >
                        </Layer>
                    }
                    {layer.severityLevel === 3 &&
                        <Layer
                            key={i}
                            id={layer.id}
                            type={layer.type}
                            source={layer.source}
                            layout={{}}
                            paint={{
                                'line-color': '#edf50a',
                                'line-width': 3
                            }}
                        >
                        </Layer>
                    }
                    {layer.severityLevel === 4 &&
                        <Layer
                            key={i}
                            id={layer.id}
                            type={layer.type}
                            source={layer.source}
                            layout={{}}
                            paint={{
                                'line-color': '#118626',
                                'line-width': 3
                            }}
                        >
                        </Layer>
                    }
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