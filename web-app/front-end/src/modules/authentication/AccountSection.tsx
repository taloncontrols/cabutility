import * as React from 'react';
import { inject, observer } from 'mobx-react';
import './accountSection.scss';
import { RouterStore } from 'mobx-react-router';
import { AuthenticationStoreClass } from './AuthenticationStore';
import * as routing from '../routing/routing';
import classNames from 'classnames';

interface IAccountSectionProps {
    isCollapsed: boolean;
    routingStore?: RouterStore;
    authenticationStore?: AuthenticationStoreClass;
}

const AccountSection = inject('authenticationStore', 'routingStore')(observer((props: IAccountSectionProps) => {
    return (
        <div className={classNames({
            accountSection: true,
            'w-100': true,
            collapsed: props.isCollapsed,
        })}>
            <div className='avatar'>TU</div>
            <div className='name'>Test, <br/> User</div>
            <div className='logout' onClick={(): void => {
                props.authenticationStore.logout();
                props.routingStore.push(routing.getUrl('login'));
            } }/>
        </div>
    );
}));

export default AccountSection;
