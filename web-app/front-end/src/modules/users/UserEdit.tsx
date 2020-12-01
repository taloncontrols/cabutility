import * as React from 'react';
import UserStore from './UserStore';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';
import './user.scss';
import { RouterStore } from 'mobx-react-router';
import BaseEditableUser from './BaseEditableUser';
import * as routing from '../routing/routing';

interface IUserEditProps {
    userId: string;
    userStore?: UserStore;
    routingStore?: RouterStore;
}

@inject('routingStore', 'rolesStore', 'userStore')
@observer
class UserEdit extends BaseEditableUser<IUserEditProps> {
    public componentDidMount(): void {
        super.componentDidMount();
        this.props.userStore.setId(this.props.userId);
    }

    protected renderActionButton(): React.ReactNode {
        return (
            <Button color='primary' onClick={(): void => this.updateUser()}>
                Update
            </Button>
        );
    }

    protected shouldRenderReadonlyFields(): boolean {
        return true;
    }

    private updateUser(): void {
        this.props.userStore.updateUser().then(() => {
            this.props.routingStore.push(routing.getUrl('users.user', { user: this.props.userStore.id }));
        }).catch((): void => undefined);
    }
}

export default UserEdit;
