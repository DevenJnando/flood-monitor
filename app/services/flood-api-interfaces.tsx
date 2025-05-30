'use server'
import {GeoJSON} from "geojson";

export interface FloodArea {
    "@id": string;
    "county": string;
    "notation": string;
    "polygon": string;
    "riverOrSea": string; //Despite the name of this field,
    // sometimes the value of this field will be "groundwater"
    // indicating the flood has been caused by heavy rainfall.
}

export interface Coordinates {
    "x": number;
    "y": number;
}

export interface Envelope {
    "lowerCorner": Coordinates;
    "upperCorner": Coordinates;
}

export interface DetailedFloodArea extends FloodArea {
    "description": string;
    "eaAreaName": string;
    "envelope": Envelope;
    "floodWatchArea": string;
    "fwdCode": string;
    "label": string;
    "lat": number;
    "long": number;
    "quickDialNumber": string;
    "type": [];
}

export interface DetailedFloodAreaWithWarning extends DetailedFloodArea {
    "currentWarning"?: FloodWarning;
}

export interface FloodWarning {
    "@id": string;
    "description"?: string;
    "eaAreaName": string;
    "eaRegionName"?: string;
    "floodArea": FloodArea;
    "detailedFloodArea"?: DetailedFloodArea;
    "floodAreaGeoJson"?: GeoJSON;
    "floodAreaID": string;
    "isTidal"?: boolean;
    "message": string;
    "severity": string;
    "severityLevel": number;
    "timeMessageChanged": string;
    "timeRaised": string;
    "timeSeverityChanged": string;
}

export interface Measure {
    "@id": string;
    "parameterName": string;
    "period": number;
    "qualifier": string;
    "unitName": string;
    "latestReading"?: MeasureReading;
}

export interface MonitoringStation {
    "@id": string;
    "RLOIid": string;
    "catchmentName": string;
    "dateOpened": string;
    "easting": number;
    "label": string | string[];
    "lat": number | number[];
    "long": number | number[];
    "measures": Measure[];
    "northing": number;
    "notation": string;
    "riverName": string;
    "stageScale": string;
    "stationReference": string;
    "status": string;
    "town": string;
    "wiskiID": string;
}

export interface MeasureReading {
    "@id": string;
    "dateTime": string;
    "measure": string;
    "value": number;
}