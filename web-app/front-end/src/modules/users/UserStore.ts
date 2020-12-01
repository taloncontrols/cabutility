import { action, computed, observable } from 'mobx';
import * as userDataService from './userDataService';
import RolesStore from '../roles/RolesStore';
import WithValidationStore from '../validation/WithValidationStore';

export interface IUserData {
    id?: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    role: string;
    email: string;
    phoneNumber?: string;
    isActive: boolean;
    userName: string;
    rfidCardNumber?: string;
    fingerprintsCount?: number;
    password?: string;
    fullName?: string;
}

export interface IExistingUserData extends IUserData {
    id: string;
}

export enum Status {
    Active = 'active',
    Inactive = 'inactive',
}

export default class UserStore extends WithValidationStore<IUserData> implements IUserData {
    @observable id?: string;
    @observable firstName = '';
    @observable lastName = '';
    @observable jobTitle = '';
    @observable role: string = this.rolesStore.getFirstAvailableRoleName();
    @observable email = '';
    @observable phoneNumber?: string;
    @observable isActive = true;
    @observable userName = '';

    @observable rfidCardNumber?: string;
    @observable fingerprintsCount?: number;

    @observable password?: string;

    public constructor(private rolesStore: RolesStore) {
        super();
    }

    @computed
    get fullName(): string {
        return `${this.firstName ? this.firstName : ''}, ${this.lastName ? this.lastName : ''}`;
    }

    @action
    public emptyStore(): void {
        this.id = undefined;
        this.firstName = '';
        this.lastName = '';
        this.jobTitle = '';
        this.email = '';
        this.phoneNumber = undefined;
        this.isActive = true;
        this.userName = '';
        this.role = this.rolesStore.getFirstAvailableRoleName();

        this.rfidCardNumber = undefined;
        this.fingerprintsCount = undefined;
        this.password = undefined;
    }

    @action
    public setId(id?: string): void {
        this.emptyStore();
        this.id = id;

        if (!id) {
            return;
        }

        userDataService.getUser(id).then((data) => {
            Object.assign(this, data);

            //TODO: add rfidCardNumber
            //TODO: add fingerprint
            this.fingerprintsCount = 4;
            this.rfidCardNumber = '345875698';
            this.password = undefined;
        });
    }

    @action
    public setFirstName(value: string): void {
        this.firstName = value;
    }

    @action
    public setLastName(value: string): void {
        this.lastName = value;
    }

    @action
    public setJobTitle(value: string): void {
        this.jobTitle = value;
    }

    @action
    public setRole(value: string): void {
        this.role = value;
    }

    @action
    public setEmail(value: string): void {
        this.email = value;
    }

    @action
    public setPhoneNumber(value: string): void {
        this.phoneNumber = value;
    }

    @action
    public setUserName(value: string): void {
        this.userName = value;
    }

    @action
    public setPassword(value: string): void {
        this.password = value;
    }

    @action
    public deactivate(): void {
        userDataService.deactivate(this.id).then(() => {
            this.isActive = false;
        })
    }

    public updateUser(): Promise<void> {
        return userDataService.updateUser(this as IExistingUserData);
    }

    public createUser(): Promise<string> {
        this.checkUserRole();
        return userDataService.createUser(this).catch((errors) => {
            this.processErrorResponse(errors);
            throw errors;
        });
    }

    @action
    private checkUserRole(): void {
        if (!this.role) {
            this.role = this.rolesStore.getFirstAvailableRoleName();
        }
    }
}
