import authenticationStore from './AuthenticationStore';


export function getAuthorizationHeader(): { Authorization: string } {
    return {
        Authorization: `${authenticationStore.tokenType} ${authenticationStore.token}`,
    };
}
