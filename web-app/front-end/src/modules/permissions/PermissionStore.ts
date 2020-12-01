import { observable, reaction } from 'mobx';
import { PermissionValue } from './config';
import * as permissionsService from './permissionsService';
import { AuthenticationStoreClass } from '../authentication/AuthenticationStore';

export default class PermissionStore {
    @observable permissions: PermissionValue[] = [];

    constructor(authenticationStore: AuthenticationStoreClass) {
        permissionsService.getPermissionsFromServer().then((permissions: PermissionValue[]) => {
            this.permissions = permissions;
        });

        reaction(() => authenticationStore.token, () => {
            permissionsService.getPermissionsFromServer().then((permissions: PermissionValue[]) => {
                this.permissions = permissions;
            });
        });
    }

    public hasPermission(permission: PermissionValue): boolean {
        return this.permissions.includes(permission);
    }
}
