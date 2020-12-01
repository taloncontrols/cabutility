import axios from 'axios';
import { API_URL, BASE_API_URL } from '../../config/config';
import * as authHelper from './authenticationHelper';

const CLIENT_ID = 'react-app';
const GRANT_TYPE = 'password';
const GRANT_TYPE_PIN = 'pin';
const AUTHENTICATE_URL = `${BASE_API_URL}/connect/token`
const TEST_AUTHENTICATION_URL = `${API_URL}/values/1`;

export interface IAuthenticateResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
}

export async function makeAuthenticateRequest(username: string, password: string): Promise<IAuthenticateResponse> {
    const formData: FormData = new FormData();

    formData.set('client_id', CLIENT_ID);
    formData.set('grant_type', GRANT_TYPE);
    formData.set('username', username);
    formData.set('password', password);

    return axios.post<IAuthenticateResponse>(AUTHENTICATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then((response) => {
            return response.data;
        },
        );
}

export async function makeAuthenticateByPinRequest(pin: string): Promise<IAuthenticateResponse> {
    const formData: FormData = new FormData();

    formData.set('client_id', CLIENT_ID);
    formData.set('grant_type', GRANT_TYPE_PIN);
    formData.set('pin', pin);
   
   var d={
       access_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IlB4UkQ0TUxBcjhSNGhydGpJUExja2ciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1OTM3MDgxMzAsImV4cCI6MTU5MzcwOTkzMCwiaXNzIjoiaHR0cDovL2gxLmxvY2FsaG9zdDo1MDAwIiwiYXVkIjoiSWRlbnRpdHlTZXJ2ZXJBcGkiLCJjbGllbnRfaWQiOiJyZWFjdC1hcHAiLCJzdWIiOiJlZThjMmM1Ny1hNjk5LTRiNDUtYjJmMS1iYjczYjA3ZTk5OGQiLCJhdXRoX3RpbWUiOjE1OTM3MDgxMzAsImlkcCI6ImxvY2FsIiwicGVybWlzc2lvbiI6WyJyb2xlLmFyY2hpdmUiLCJyb2xlLmVkaXQiLCJ1c2VyLnZpZXciLCJyb2xlLmhpc3RvcnkiLCJyb2xlLnZpZXciLCJ1c2VyLmFyY2hpdmUiLCJ1c2VyLmFzc2lnbiIsInVzZXIuY29uZmlndXJlIiwidXNlci5lZGl0IiwicGhhcm0uZGVsZXRlIiwicGhhcm0uZWRpdCIsInBoYXJtLnZpZXciLCJzdXBwbHkuZGVsZXRlIiwic3VwcGx5LmVkaXQiLCJzdXBwbHkudmlldyIsIm90aGVyLmRlbGV0ZSIsIm90aGVyLmVkaXQiLCJvdGhlci52aWV3Il0sInRlbmFudGlkIjoiMDcyZmMzNTQtMWU3NC00YTNjLThmYzctYjAzNjE0ZjVmMmNhIiwidGVuYW50ZG9tYWlubmFtZSI6ImgxIiwiaWQiOiJlZThjMmM1Ny1hNjk5LTRiNDUtYjJmMS1iYjczYjA3ZTk5OGQiLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiU21pdGgiLCJuYW1lIjoiSm9obiBTbWl0aCIsInJvbGUiOiJTdXBlcnZpc29yIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsIklkZW50aXR5U2VydmVyQXBpIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.Uc9VscPbknki4HUI80TwqvI7C5BGbLu5yPs3p3wWyXcLixnDisiHijfQpC0sC5CH4D_Nn3u25Errp2jkt2yEq2SFA1XTkSvKzXOZ4SGYpReJRZGi9T8ABEuOYYpfmP9kMRFws61yKJ83moO4f2U8QVsW7xh4-Slag1VeV9Wl9j9VBqcn7cu529TZf3RpQFpJIAIJRAetGtIipjEUIS5dthIJxG3kabWS8a7aaJYPMmppZgmvE0ukjSn6yEWyV7bPjEDHEfxUYwYhWO1HGkKy-v19S-_o8a6i02VK6Tpp8coYgN-SNo3Hu5JBNaPPiJV1zA64jKRV1JE8nnrC1FPwcA"
        ,expires_in: 1800
        ,refresh_token: "iHyVjhUt1d-tnj_CoYxRwSXr5fksESpLN45QZ6M3arU"
        ,scope: "IdentityServerApi offline_access openid profile"
        ,token_type: "Bearer"
        };
        return d;

    /* return axios.post<IAuthenticateResponse>(AUTHENTICATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then((response) => {
            return response.data;
        },
        ); */
}

export async function validateAuthentication(): Promise<void> {
    return axios.get(TEST_AUTHENTICATION_URL, {
        headers: authHelper.getAuthorizationHeader(),
    }).then((response) => {
        return response.data;
    });
}
