import type {LayerProps} from "react-map-gl/mapbox";

export const outlineLayer: LayerProps = {
    id: 'outline',
    type: 'line',
    source: 'floods',
    layout: {},
    paint: {
        'line-color': '#000',
        'line-width': 3
    }
}