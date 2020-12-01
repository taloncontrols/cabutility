import * as React from 'react';
import { Switch, Route } from 'react-router';
import * as routing from '../routing/routing';
import RoleEdit from './RoleEdit';
import RoleCreate from './RoleCreate';
import RoleView from './RoleView';
import Roles from './Roles';
import { PermissionValue } from '../permissions/config';
import Permission from '../permissions/Permission';

const Role = (): React.ReactElement => {
    return (
        <div className='role fullWidth fullHeight'>
            <Switch>
                <Route path={routing.getUrl('roles.create')} >
                    <Permission requiredPermissions={[PermissionValue.ROLE_EDIT]}><RoleCreate /></Permission>
                </Route>
                <Route path={routing.getUrl('roles.role.edit')} render={({ match }): React.ReactElement => {
                    return <Permission requiredPermissions={[PermissionValue.ROLE_EDIT]}><RoleEdit roleId={match.params.role} /></Permission>;
                }} />
                <Route path={routing.getUrl('roles.role')} render={({ match }): React.ReactElement => {
                    return <Permission requiredPermissions={[PermissionValue.ROLE_VIEW]}><RoleView roleId={match.params.role} /></Permission>;
                }} />
                <Route path={routing.getUrl('roles')} >
                    <Permission requiredPermissions={[PermissionValue.ROLE_VIEW]}><Roles /></Permission>
                </Route>
            </Switch>
        </div>
    );
}

export default Role;
