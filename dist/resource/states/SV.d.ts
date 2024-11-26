export const states: ({
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    country_name: string;
    state_code: string;
    type: null;
    latitude: string;
    longitude: string;
} | {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    country_name: string;
    state_code: string;
    type: null;
    latitude: null;
    longitude: null;
})[];
