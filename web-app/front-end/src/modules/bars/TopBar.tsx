import * as React from 'react';
import './topBar.scss';
import logoutIcon from '../../static/images/icons/logout.svg';
import { RouterStore } from 'mobx-react-router';
import { AuthenticationStoreClass } from '../authentication/AuthenticationStore';
import { inject, observer } from 'mobx-react';
import * as routing from '../routing/routing';

interface ITopBarProps {
    routingStore?: RouterStore;
    authenticationStore?: AuthenticationStoreClass;
}

@inject('authenticationStore', 'routingStore')
@observer
class TopBar extends React.Component<ITopBarProps> {
    public render(): React.ReactNode {
        return (
            <div className='w-100 topBar'>
                <img src={logoutIcon} alt='' className='float-right' onClick={(): void => this.logout()}/>
            </div>
        );
    }

    private logout(): void {
        this.props.authenticationStore.logout();
        this.props.routingStore.push(routing.getUrl('login'));
    }
}

export default TopBar;
