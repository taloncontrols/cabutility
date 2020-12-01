import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import * as history from 'history';
import { Router } from 'react-router';
import './app.scss';
import authenticationStore from './modules/authentication/AuthenticationStore';
import App from './App';
import RolesStore from './modules/roles/RolesStore';
import UserStore from './modules/users/UserStore';
import RoleStore from './modules/roles/RoleStore';
import * as rolesDataService from './modules/roles/userRolesDataService';
import Roles from './modules/roles/Roles';
import * as routing from './modules/routing/routing';
import leftMenuStore from './modules/leftMenu/LeftMenuStore';
import PermissionStore from './modules/permissions/PermissionStore';

const browserHistory = history.createBrowserHistory();
const routingStore = new RouterStore();
const historySync = syncHistoryWithStore(browserHistory, routingStore);

const rolesStore = new RolesStore(Roles.getDefaultFilters(), rolesDataService, authenticationStore);
const userStore = new UserStore(rolesStore);
const roleStore = new RoleStore();
const permissionStore = new PermissionStore(authenticationStore);

const stores = {
    routingStore,
    authenticationStore,
    rolesStore,
    userStore,
    roleStore,
    leftMenuStore,
    permissionStore,
};

authenticationStore.isValidAuthentication().then((result) => {
    if (!result) {
        routingStore.push(routing.getUrl('keypad'));
    }
});

ReactDOM.render(
    <Provider {...stores}>
        <Router history={ historySync } >
            <App />
        </Router>
    </Provider>,
    document.getElementById('app'),
);
