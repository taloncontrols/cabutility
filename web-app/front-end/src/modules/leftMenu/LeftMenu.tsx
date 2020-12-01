import * as React from 'react';
import logo from '../../static/images/logo.svg';
import collapseIcon from '../../static/images/collapse_icon.svg';
import './leftMenu.scss';
import { inject, observer } from 'mobx-react';
import { LeftMenuStoreClass } from './LeftMenuStore';
import { ILeftMenuConfig } from './config';
import LeftMenuItem from './LeftMenuItem';
import AccountSection from '../authentication/AccountSection';
import classNames from 'classnames';

function renderLogo(): React.ReactElement {
    return <img src={logo} className='logo' alt=''/>;
}

function renderCollapseIcon(callback: () => void): React.ReactElement {
    return <img src={collapseIcon} className='collapseIcon' alt='' onClick={callback} />;
}

function renderMenu(menuItems: ILeftMenuConfig[], isMenuCollapsed: boolean): React.ReactElement {
    return (
        <ul className='w-100 leftMenuContainer'>
            { menuItems.map((menuItem: ILeftMenuConfig): React.ReactElement => {
                return <LeftMenuItem key={ menuItem.name } item={ menuItem } isMenuCollapsed={isMenuCollapsed} />;
            }) }
        </ul>
    );
}

function renderBottomSection(isCollapsed: boolean): React.ReactElement {
    return <AccountSection isCollapsed={isCollapsed} />
}

interface ILeftMenuProps {
    leftMenuStore?: LeftMenuStoreClass;
}

const LeftMenu = inject('leftMenuStore')(observer((props: ILeftMenuProps): React.ReactElement => {
    return (
        <div className={classNames({
            leftMenu: true,
            collapsed: props.leftMenuStore.isCollapsed,
        })}>
            { renderLogo() }
            { renderCollapseIcon(() => props.leftMenuStore.toggle()) }
            <div className='clearfix' />

            { renderMenu(props.leftMenuStore.menuItems, props.leftMenuStore.isCollapsed) }
            { renderBottomSection(props.leftMenuStore.isCollapsed) }
        </div>
    );
}));

export default LeftMenu;
