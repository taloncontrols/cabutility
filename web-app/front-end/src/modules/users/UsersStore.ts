import { action } from 'mobx';
import { IExistingUserData } from './UserStore';
import ScrollableGridStore, { IScrollableGridDataService } from '../scrollableGrid/ScrollableGridStore';

interface IUsersDataService extends IScrollableGridDataService<IExistingUserData> {
    deactivate(id: string): Promise<void>;
}

class UsersStore extends ScrollableGridStore<IExistingUserData>{
    protected dataService: IUsersDataService;

    @action
    public archiveUser(user: IExistingUserData): void {
        this.dataService.deactivate(user.id).then(() => {
            const userToChange = this.data.find((item) => {
                return item.id === user.id;
            });

            userToChange.isActive = false;
        });
    }
}

export default UsersStore;
