import React from 'react';
import { PermissionValue } from './config';
import { inject, observer } from 'mobx-react';
import PermissionStore from './PermissionStore';

interface IPermissionProps {
    requiredPermissions: PermissionValue[];
    children: React.ReactNode;
    permissionStore?: PermissionStore;
}

const Permission = (inject('permissionStore'))(observer((props: IPermissionProps): React.ReactElement => {
    const hasAllRequiredPermissions = !props.requiredPermissions.some((requiredPermission: PermissionValue): boolean => {
        return !props.permissionStore.hasPermission(requiredPermission);
    });

    if (!hasAllRequiredPermissions) {
        return;
    }

    return <>{ props.children }</>;
}));

export default Permission;
