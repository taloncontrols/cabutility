import { action, observable } from 'mobx';

class LeftMenuItemStore {
    @observable public isOpened: boolean;

    @action
    public open(): void {
        this.isOpened = true;
    }

    @action
    public close(): void {
        this.isOpened = false;
    }

    @action
    public toggle(): void {
        this.isOpened = !this.isOpened;
    }
}

export default LeftMenuItemStore;
