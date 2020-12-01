const hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = process.env.API_PORT;

export const BASE_API_URL = `${protocol}//${hostname}:${port}`;
export const API_URL = `${BASE_API_URL}/api/1.0`;
