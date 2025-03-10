export interface FloodArea {
    "@id": string;
    "county": string;
    "description"?: string;
    "eaAreaName"?: string;
    "floodWatchArea"?: string;
    "fwdCode"?: string;
    "label"?: string;
    "lat"?: number;
    "long"?: number;
    "notation": string;
    "polygon": string;
    "quickDialNumber"?: string;
    "riverOrSea": string; //Despite the name of this field,
    // sometimes the value of this field will be "groundwater"
    // indicating the flood has been caused by heavy rainfall.
}

export interface FloodWarning {
    "@id": string;
    "description"?: string;
    "eaAreaName": string;
    "eaRegionName"?: string;
    "floodArea": FloodArea;
    "floodAreaId": string;
    "isTidal"?: boolean;
    "message": string;
    "severity": string;
    "severityLevel": number;
    "timeMessageChanged": string;
    "timeRaised": string;
    "timeSeverityChanged": string;
}