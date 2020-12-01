import axios from 'axios';
import { API_URL } from '../../config/config';
import { PermissionValue } from './config';
import { getAuthorizationHeader } from '../authentication/authenticationHelper';

const URL = `${API_URL}/permissions/userPermissions`;

export async function getPermissionsFromServer(): Promise<PermissionValue[]> {
    return axios.get<PermissionValue[]>(URL, {
        headers: getAuthorizationHeader(),
    }).then((response) => {
        return response.data;
    });
}
