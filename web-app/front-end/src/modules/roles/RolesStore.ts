import { action, observable, reaction } from 'mobx';
import  * as _ from 'lodash';
import BaseGridStore, { IDataService } from '../scrollableGrid/BaseGridStore';
import { Filters } from '../filters/FiltersBody';
import { AuthenticationStoreClass } from '../authentication/AuthenticationStore';

export interface IUserRole {
    id: string;
    name: string;
    isActive: boolean;
}

interface IRolesDataService extends IDataService<IUserRole> {
    deactivate(id: string): Promise<void>;
}

class RolesStore extends BaseGridStore<IUserRole> {
    @observable dataService: IRolesDataService;

    constructor(defaultFilters: Filters<IUserRole>, dataService: IRolesDataService, private authenticationStore: AuthenticationStoreClass) {
        super(defaultFilters, dataService);

        this.refreshData();

        reaction(() => authenticationStore.token, () => {
            this.refreshData();
        });
    }

    @action
    public loadMoreItems(): Promise<IUserRole[]> {
        return this.dataService.loadMoreItems(this.getRequestData()).then(({ data }) => {
            this.data = data;

            return data;
        });
    }

    @action
    public archiveRole(role: IUserRole): void {
        this.dataService.deactivate(role.id).then(() => {
            const roleToChange = this.data.find((item) => {
                return item.id === role.id;
            });

            roleToChange.isActive = false;
        });
    }

    public getFirstAvailableRoleName(): string{
        return _.get(this.data, '0.name', '');
    }
}

export default RolesStore;
