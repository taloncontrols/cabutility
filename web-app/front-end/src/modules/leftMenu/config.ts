import settingsIcon from '../../static/images/icons/icon_settings.svg';
import * as routing from '../routing/routing';
import { PermissionValue } from '../permissions/config';

export interface ILeftMenuConfig {
    children?: ILeftMenuConfig[];
    name: string;
    route?: string;
    icon?: string;
    permission?: PermissionValue;
}

const config: ILeftMenuConfig[] = [{
    name: 'Settings',
    icon: settingsIcon,
    children: [{
        name: 'User Groups',
        route: routing.getUrl('roles'),
        permission: PermissionValue.ROLE_VIEW,
    }, {
        name: 'Users',
        route: routing.getUrl('users'),
        permission: PermissionValue.USER_VIEW,
    }],
}];

export default config;
