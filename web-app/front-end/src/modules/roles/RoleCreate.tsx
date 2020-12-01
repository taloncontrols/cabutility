import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';
import BaseEditableRole, { IEditableRoleProps } from './baseEditableRole';
import './role.scss';
import * as routing from '../routing/routing';

@inject('routingStore', 'roleStore')
@observer
class RoleCreate extends BaseEditableRole<IEditableRoleProps> {
    public componentDidMount(): void {
        super.componentDidMount();
        this.props.roleStore.getPermissionList();
    }
    protected renderActionButton(): React.ReactNode {
        return(
            <Button color='primary' onClick={(): void => this.createRole()}>
                Create
            </Button>
        );
    }

    private createRole(): void {
        this.props.roleStore.createRole().then((roleId: string) => {
            this.props.routingStore.push(routing.getUrl('roles.role', { role: roleId }));
        });
    }
}

export default RoleCreate;
