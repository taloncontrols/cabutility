import { action, observable } from 'mobx';
import leftMenuConfig, { ILeftMenuConfig } from './config';

export class LeftMenuStoreClass {
    @observable
    public menuItems: ILeftMenuConfig[];

    @observable
    public isCollapsed = false;

    constructor() {
        this.menuItems = leftMenuConfig;
    }

    @action
    public toggle(): void {
        this.isCollapsed = !this.isCollapsed;
    }
}

export default new LeftMenuStoreClass();
