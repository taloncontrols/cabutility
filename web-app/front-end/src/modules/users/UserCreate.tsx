import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';
import './user.scss';
import BaseEditableUser, { IEditableUserProps } from './BaseEditableUser';
import * as routing from '../routing/routing';

@inject('routingStore', 'rolesStore', 'userStore')
@observer
class UserCreate extends BaseEditableUser<IEditableUserProps> {
    protected renderActionButton(): React.ReactNode {
        return(
            <Button color='primary' onClick={(): void => this.createUser()}>
                Create
            </Button>
        );
    }

    protected shouldRenderReadonlyFields(): boolean {
        return false;
    }

    private createUser(): void {
        this.props.userStore.createUser().then((userId: string) => {
            this.props.routingStore.push(routing.getUrl('users.user', { user: userId }));
        }).catch(() => undefined);
    }
}

export default UserCreate;
