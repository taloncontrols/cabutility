import { action, observable } from 'mobx';
import * as userRolesDataService from './userRolesDataService';

export interface IRoleData {
    id?: string;
    name: string;
    isActive: boolean;
    assignedPermissions?: string[];
}

export interface IPermissionData {
    name: string;
    value: string;
    requiredPermissions?: string[];
}

export interface IPermissionsData {
    name: string;
    permissions: IPermissionData[];
    isExpanded?: boolean;
}

export enum Status {
    Active = 'active',
    Inactive = 'inactive',
}

export interface IPermissionGroupsData {
    [group: string]: IPermissionsData[];
}

export default class RoleStore implements IRoleData {
    @observable id?: string;
    @observable name = '';
    @observable isActive = true;
    @observable assignedPermissions: string[] = [];
    @observable permissionList: IPermissionsData[] = [];
    @observable activeTab = '0';

    @action
    public emptyStore(): void {
        this.id = undefined;
        this.name = '';
        this.assignedPermissions = [];
    }

    @action
    public setId(id?: string): void {
        this.emptyStore();
        this.getPermissionList();
        this.id = id;

        if (!id) {
            return;
        }

        userRolesDataService.getRole(id).then((data) => {
            Object.assign(this, data);
        });
    }

    @action
    public setName(name: string): void {
        this.name = name;
    }

    @action
    public expandPermissionList(): void {
        this.permissionList.forEach(permissionGroup => {
            permissionGroup.isExpanded = true;
        })
    }

    @action
    public getPermissionList(): void {
        userRolesDataService.getPermissionList().then((data) => {
            Object.assign(this.permissionList, data.groups);
            this.expandPermissionList();
        });
    }

    @action
    public toggleGroupCollapse(group: IPermissionsData): void {
        group.isExpanded = !group.isExpanded;
    }

    @action
    public togglePermissionSelectionWithRequired(permission: IPermissionData, checked: boolean): void {
        if (permission.requiredPermissions && checked) {
            permission.requiredPermissions.forEach(value => {
                this.togglePermissionSelection(value, checked);
            })
        }

        if (!checked) {
            this.disableRequiringPermissions(permission.value)
        }

        this.togglePermissionSelection(permission.value, checked);
    }

    @action
    private togglePermissionSelection(value: string, checked: boolean): void {
        if (checked && !this.isPermissionEnabled(value)) {
            this.addPermission(value);
        }
        if (!checked && this.isPermissionEnabled(value)) {
            this.removePermission(value);
        }
    }

    @action
    private disableRequiringPermissions(value: string): void {
        this.permissionList.forEach(group => {
            group.permissions.forEach(permission => {
                if (this.isPermissionEnabled(permission.value) && permission.requiredPermissions.includes(value) && permission.value !== value) {
                    this.removePermission(permission.value);
                }
            })
        });
    }

    @action
    public togglePermissionGroupSelection(group: IPermissionsData, checked: boolean): void {
        group.permissions.forEach(permission => {
            this.togglePermissionSelection(permission.value, checked);
        })
    }

    @action setActiveTab(tab: string): void {
        if (this.activeTab !== tab) {
            this.activeTab = tab;
        }
    }

    @action
    public addPermission(value: string): void {
        this.assignedPermissions.push(value);
    }

    @action
    public removePermission(value: string): void {
        this.assignedPermissions.splice(this.assignedPermissions.indexOf(value), 1);
    }

    public isPermissionGroupFullSelected(group: IPermissionsData): boolean {
        return (group.permissions.every(permission => this.isPermissionEnabled(permission.value)))
    }

    public isPermissionEnabled(permissionValue: string): boolean {
        return this.assignedPermissions.includes(permissionValue);
    }

    public updateRole(): Promise<void> {
        return userRolesDataService.updateRole(this);
    }

    public createRole(): Promise<string> {
        return userRolesDataService.createRole(this);
    }

    @action
    public archiveRole(): void {
        const current = this.isActive;
        this.isActive = false;
        userRolesDataService.deactivate(this.id).then(() => {
            this.isActive = false;
        }).catch(() => {
            this.isActive = current;
        });
    }
}
