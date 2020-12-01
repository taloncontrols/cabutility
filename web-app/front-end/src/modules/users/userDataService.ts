import axios from 'axios';
import qs from 'qs';
import * as _  from 'lodash';
import { API_URL } from '../../config/config';
import * as authHelper from '../authentication/authenticationHelper';
import { IExistingUserData, IUserData } from './UserStore';
import { IScrollableGridDataResponse, IScrollableGridRequestData } from '../scrollableGrid/ScrollableGridStore';
import * as routing from '../routing/routing';

const USER_URL = `${API_URL}/users`;
const DEACTIVATE_URL = `${USER_URL}/:user/deactivate`;

export async function getUser(id: string): Promise<IExistingUserData> {
    return axios.get<IExistingUserData>(`${USER_URL}/${id}`, {
        headers: authHelper.getAuthorizationHeader(),
    }).then((response) => response.data);
}

function prepareData(user: IUserData): Partial<IUserData> {
    const keys = ['firstName', 'lastName', 'jobTitle', 'password', 'userName', 'role', 'email'];

    return _.pickBy(user, (value, key) => {
        return !_.isEmpty(value) && keys.includes(key);
    });
}

export async function updateUser(user: IExistingUserData): Promise<void> {
    const data = prepareData(user);

    return axios.put(`${USER_URL}/${user.id}`, data, {
        headers: {
            ...authHelper.getAuthorizationHeader(),
        },
    }).then((response) => response.data);
}

export async function createUser(user: IUserData): Promise<string> {
    const data = prepareData(user);

    return axios.post(USER_URL, data, {
        headers: authHelper.getAuthorizationHeader(),
    }).then((response) => {
        return response.data
    }).catch((error) => {
        throw error.response.data;
    });
}

export async function deactivate(userId: string): Promise<void> {
    return axios.post(routing.fillUrlWithParams(DEACTIVATE_URL, { user: userId }), {},{
        headers: authHelper.getAuthorizationHeader(),
    }).then((response) => response.data);
}

export function loadMoreItems(data: IScrollableGridRequestData<IUserData>): Promise<IScrollableGridDataResponse<IExistingUserData>> {
    return axios.get<IScrollableGridDataResponse<IExistingUserData>>(USER_URL, {
        headers: authHelper.getAuthorizationHeader(),
        params: data,
        paramsSerializer: (params) => {
            return qs.stringify(params);
        },
    }).then(({ data }) => {
        return data;
    });
}
