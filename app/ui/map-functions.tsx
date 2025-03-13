import {MapRef} from "react-map-gl/mapbox";
import {FloodArea} from "@/app/services/flood-api-interfaces";
import {getFloodAreaGeoJson} from "@/app/services/flood-api-calls";


export async function addSourceToMapWithLayer(mapRef: MapRef | null, floodArea: FloodArea) {
    if(mapRef){
        await addFloodAreaToMap(mapRef, floodArea);
        addFloodAreaLayerToMap(mapRef, floodArea);
    }
}

export async function addFloodAreaToMap(mapRef: MapRef, floodArea: FloodArea) {
    const floodAreaGeoJson = await getFloodAreaGeoJson(floodArea.polygon);
    mapRef?.getMap().addSource(floodArea["@id"], {type:"geojson", data: floodAreaGeoJson});

}

export function addFloodAreaLayerToMap(mapRef: MapRef | null, floodArea: FloodArea) {
    mapRef?.getMap().addLayer({
        id: floodArea["@id"],
        type: 'line',
        source: floodArea["@id"],
        layout: {},
        paint: {
            'line-color': '#000',
            'line-width': 3
        }
    });
}