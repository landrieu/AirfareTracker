//export const API_PATH = "http://localhost:4000/";
export const ENV = 'DEV'; //'PROD'

const API_PATHs = {
    DEV: "http://localhost:8089/airfares-tracker/api/",
    PROD: "api/"
}

export const API_PATH = API_PATHs[ENV];