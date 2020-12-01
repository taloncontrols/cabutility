import * as React from 'react';
import { Route, Switch } from 'react-router';
import UserView from './UserView';
import UserEdit from './UserEdit';
import Users from './Users';
import UserCreate from './UserCreate';
import UsersStore from './UsersStore';
import * as userDataService from './userDataService';
import * as routing from '../routing/routing';
import Permission from '../permissions/Permission';
import { PermissionValue } from '../permissions/config';

const USER_COUNT_PER_LOAD = 20;

const usersStore = new UsersStore({ isActive: true }, userDataService, USER_COUNT_PER_LOAD);

const User = (): React.ReactElement => {
    return (
        <div className='user w-100 h-100'>
            <Switch>
                <Route path={routing.getUrl('users.create')} >
                    <Permission requiredPermissions={[PermissionValue.USER_EDIT]}>
                        <UserCreate />
                    </Permission>
                </Route>
                <Route path={routing.getUrl('users.user.edit')} render={({ match }): React.ReactElement => {
                    return <Permission requiredPermissions={[PermissionValue.USER_EDIT]}><UserEdit userId={match.params.user} /></Permission>;
                }} />
                <Route path={routing.getUrl('users.user')} render={({ match }): React.ReactElement => {
                    return <Permission requiredPermissions={[PermissionValue.USER_VIEW]}><UserView userId={match.params.user} /></Permission>;
                }} />
                <Route path={routing.getUrl('users')}>
                    <Permission requiredPermissions={[PermissionValue.USER_VIEW]}>
                        <Users usersStore={usersStore}/>
                    </Permission>
                </Route>
                <Route path={routing.getUrl('home')}>
                    <Permission requiredPermissions={[PermissionValue.USER_VIEW]}>
                        <Users usersStore={usersStore}/>
                    </Permission>
                </Route>
            </Switch>
        </div>
    );
}

export default User;
