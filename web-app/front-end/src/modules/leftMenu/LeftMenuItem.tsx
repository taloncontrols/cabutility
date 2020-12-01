import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ILeftMenuConfig } from './config';
import classNames from 'classnames';
import { RouterStore } from 'mobx-react-router';
import LeftMenuItemStore from './LeftMenuItemStore';
import PermissionStore from '../permissions/PermissionStore';
import './leftMenuItem.scss';

interface ILeftMenuItemProps {
    item: ILeftMenuConfig;
    routingStore?: RouterStore;
    permissionStore?: PermissionStore;
    isMenuCollapsed: boolean;
}

function isSelected(currentLocation: string, item: ILeftMenuConfig): boolean {
    if (!item.route) {
        if (!item.children) {
            return false;
        }

        return item.children.some((subItem: ILeftMenuConfig) => {
            return isSelected(currentLocation, subItem);
        });
    }

    return currentLocation.substr(0, item.route.length) === item.route;
}

@inject('routingStore', 'permissionStore')
@observer
class LeftMenuItem extends React.Component<ILeftMenuItemProps> {
    private store: LeftMenuItemStore;

    constructor(props: ILeftMenuItemProps) {
        super(props);
        this.store = new LeftMenuItemStore();
    }

    public render(): React.ReactElement {
        if (this.props.item.permission && !this.props.permissionStore.hasPermission(this.props.item.permission)) {
            return ;
        }
        return (
            <>
                <li
                    className={classNames({
                        selected: isSelected(this.props.routingStore.location.pathname, this.props.item),
                        opened: this.shouldItemShowExpand() && this.store.isOpened,
                        closed: this.shouldItemShowExpand() && !this.store.isOpened,
                        leftMenuItem: true,
                        collapsed: this.props.isMenuCollapsed,
                        collapsedOpened: this.props.isMenuCollapsed && this.store.isOpened,
                    })}
                    onClick={(): void => this.toggleItem(this.props.item)}
                    onMouseEnter={(): void => this.showIfCollapsed()}
                    onMouseLeave={(): void => this.hideIfCollapsed()}
                >
                    <img src={ this.props.item.icon } alt='' />
                    <span className='hided'>{ this.props.item.name }</span>
                </li>
                { this.renderChildElements() }
            </>
        );
    }

    private renderChildElements(): React.ReactElement {
        if (!this.store.isOpened || !this.props.item.children) {
            return;
        }

        return (
            <li
                className={classNames({
                    'w-100': true,
                    subItemsContainer: true,
                    collapsed: this.props.isMenuCollapsed,
                })}
                onMouseEnter={(): void => this.showIfCollapsed()}
                onMouseLeave={(): void => this.hideIfCollapsed()}
            >
                <ul className='w-100 subItems'>
                    { this.props.item.children.map((item: ILeftMenuConfig): React.ReactElement => {
                        if (item.permission && !this.props.permissionStore.hasPermission(item.permission)) {
                            return ;
                        }

                        return (
                            <li
                                key={ item.name }
                                onClick={(): void => this.toggleItem(item)}
                                className={classNames({
                                    selected: isSelected(this.props.routingStore.location.pathname, item),
                                    leftMenuItem: true,
                                    'w-100': true,
                                })}
                            >
                                { item.name }
                            </li>
                        );
                    }) }
                </ul>
            </li>
        );
    }

    private toggleItem(item: ILeftMenuConfig): void {
        if (item.children) {
            if (this.props.isMenuCollapsed) {
                return;
            }

            this.store.toggle();
            return;
        }

        if (item.route) {
            this.props.routingStore.push(item.route);
        }
    }

    private shouldItemShowExpand(): boolean {
        return !this.props.isMenuCollapsed && !!this.props.item.children;
    }

    private showIfCollapsed(): void {
        if (this.props.isMenuCollapsed && this.props.item.children) {
            this.store.open();
        }
    }

    private hideIfCollapsed(): void {
        if (this.props.isMenuCollapsed && this.props.item.children) {
            this.store.close();
        }
    }
}

export default LeftMenuItem;
