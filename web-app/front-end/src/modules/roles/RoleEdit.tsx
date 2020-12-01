import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';
import { RouterStore } from 'mobx-react-router';
import BaseEditableRole from './baseEditableRole';
import RoleStore from './RoleStore';
import './role.scss';
import * as routing from '../routing/routing';

interface IRoleEditProps {
    roleId: string;
    roleStore?: RoleStore;
    routingStore?: RouterStore;
}

@inject('routingStore', 'roleStore')
@observer
class RoleEdit extends BaseEditableRole<IRoleEditProps> {
    public componentDidMount(): void  {
        super.componentDidMount();
        this.props.roleStore.setId(this.props.roleId);
    }

    protected renderActionButton(): React.ReactNode {
        return (
            <Button color='primary' onClick={(): void => this.updateRole()}>
                Update
            </Button>
        );
    }

    private updateRole(): void {
        this.props.roleStore.updateRole().then(() => {
            this.props.routingStore.push(routing.getUrl('roles.role', { role: this.props.roleStore.id }));
        }).catch(() => undefined);
    }
}

export default RoleEdit;
