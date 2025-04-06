import {Marker} from "react-map-gl/mapbox";
import {Layer} from "react-map-gl/mapbox";
import {Source} from "react-map-gl/mapbox";
import {useStateContext} from "@/app/hooks/map-hook";
import {useSelectedFloodWarningDispatchContext} from "@/app/hooks/selected-flood-hook";
import {Fragment, Key} from "react";
import {SevereWarningMarker, WarningMarker, AlertMarker, NoLongerInForceMarker} from "@/app/ui/map-icons";
import { GeoJSON, Geometry, GeoJsonProperties } from "geojson";

export const Markers = () => {
    const {markers} = useStateContext();
    const selectedFloodDispatchContext = useSelectedFloodWarningDispatchContext();
    return (
        <Fragment>
            {markers.map((marker: {
                warning: any;
                lat: number;
                long: number;
                severityLevel: number;
            }, i: Key | null | undefined) => (
                <Marker
                    key={i}
                    onClick={() => {
                        selectedFloodDispatchContext({
                            type: "SELECT_WARNING",
                            payload: {newWarning: marker.warning}
                        });
                    }}
                    latitude={marker.lat}
                    longitude={marker.long}>
                    {marker.severityLevel === 1 &&
                        <SevereWarningMarker/>
                    }
                    {marker.severityLevel === 2 &&
                        <WarningMarker/>
                    }
                    {marker.severityLevel === 3 &&
                        <AlertMarker/>
                    }
                    {marker.severityLevel === 4 &&
                        <NoLongerInForceMarker/>
                    }
                </Marker>
            ))}
        </Fragment>
    )
}

export const Layers = () => {
    const {layers} = useStateContext();
    return (
        <Fragment>
            {layers.map((layer: {
                id: string | undefined;
                type: string;
                source: string | undefined;
                paint: {} | undefined;
            }, i: Key | null | undefined) => (
                <Fragment key={i}>
                    <Layer
                        key={i}
                        id={layer.id}
                        // @ts-ignore
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
    const {sources} = useStateContext();
    return (
        <Fragment>
            {sources.map((source: {
                id: string | undefined;
                data: string | GeoJSON<Geometry, GeoJsonProperties> | undefined;
            }, i: Key | null | undefined) => (
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