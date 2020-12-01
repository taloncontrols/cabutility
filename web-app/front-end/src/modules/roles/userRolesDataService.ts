import axios from 'axios';
import { API_URL } from '../../config/config';
import { getAuthorizationHeader } from '../authentication/authenticationHelper';
import { IUserRole } from './RolesStore';
import { IRoleData, IPermissionGroupsData } from './RoleStore';
import * as _ from 'lodash';
import { IDataResponse } from '../scrollableGrid/BaseGridStore';
import * as authHelper from '../authentication/authenticationHelper';

const ROLE_URL = `${API_URL}/roles`;
const PERMISSIONS_URL = `${API_URL}/permissions`;

export function loadMoreItems(): Promise<IDataResponse<IUserRole>> {
    return axios.get<IDataResponse<IUserRole>>(ROLE_URL, {
        headers: getAuthorizationHeader(),
        params: { count: 50 },
    }).then((response) => {
        return response.data;
    })
}

export async function getRole(id: string): Promise<IRoleData> {
    return axios.get<IRoleData>(`${ROLE_URL}/${id}`, {
        headers: getAuthorizationHeader(),
    }).then((response) => response.data);
}

export async function getPermissionList(): Promise<IPermissionGroupsData> {
    return axios.get<IPermissionGroupsData>(PERMISSIONS_URL, {
        headers: getAuthorizationHeader(),
    }).then((response) => response.data);
}

function prepareData(role: IRoleData): Partial<IRoleData> {
    const keys = ['name', 'isActive', 'assignedPermissions'];

    return _.pickBy(role, (value, key) => {
        return keys.includes(key);
    });
}

export async function updateRole(role: IRoleData): Promise<void> {
    const data = prepareData(role);

    return axios.put(`${ROLE_URL}/${role.id}`, data, {
        headers: {
            ...getAuthorizationHeader(),
        },
    }).then((response) => {
        return response.data
    }).catch((error) => {
        throw error.response.data;
    });
}

export async function createRole(role: IRoleData): Promise<string> {
    const data = prepareData(role);

    return axios.post(ROLE_URL, data, {
        headers: getAuthorizationHeader(),
    }).then((response) => {
        return response.data
    }).catch((error) => {
        throw error.response.data;
    });
}

export async function deactivate(roleId: string): Promise<void> {
    return axios.delete(`${ROLE_URL}/${roleId}`, {
        headers: authHelper.getAuthorizationHeader(),
    }).then((response) => response.data);
}
