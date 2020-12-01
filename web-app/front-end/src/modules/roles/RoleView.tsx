import RoleStore, { IPermissionsData, IPermissionData } from './RoleStore';
import { RouterStore } from 'mobx-react-router';
import * as React from 'react';
import HeaderBar from '../bars/HeaderBar';
import { Button, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Table } from 'reactstrap';
import classNames from 'classnames';
import collapse from '../../static/images/icons/collapse.svg';
import expand from '../../static/images/icons/expand.svg';
import { inject, observer } from 'mobx-react';
import { INavigationTab } from './baseEditableRole';
import confirmationPopupService from '../popup/confirmationPopupService';
import { ConfirmationPopupValues } from '../popup/ConfirmationPopupStore';
import * as routing from '../routing/routing';
import Permission from '../permissions/Permission';
import { PermissionValue } from '../permissions/config';

interface IRoleViewProps {
    roleId: string;
    roleStore?: RoleStore;
    routingStore?: RouterStore;
}

@inject('routingStore', 'roleStore')
@observer
class RoleView extends React.Component<IRoleViewProps>  {
    public componentDidMount(): void {
        this.props.roleStore.setId(this.props.roleId);
    }

    navigation: INavigationTab[] = [
        { name: 'Permissions', render: (): React.ReactElement => this.renderPermissionsGrid() },
        { name: 'Notification Settings', render: (): React.ReactElement => this.renderNotificationSettings() },
    ];

    public render(): React.ReactElement {
        return (
            <div className='w-100 h-100'>
                <HeaderBar>
                    <h2 className='float-left'>{this.props.roleStore.name}</h2>
                    <div className='float-right'>
                        <Permission requiredPermissions={[PermissionValue.ROLE_EDIT]}>
                            <Button color='primary' outline={true} onClick={(): void => this.editRole()} disabled={!this.props.roleStore.isActive}>
                                Edit
                            </Button>
                        </Permission>
                        <Permission requiredPermissions={[PermissionValue.ROLE_ARCHIVE]}>
                            <Button color='primary' outline={true} disabled={!this.props.roleStore.isActive} onClick={(): void => this.archiveRole()}>
                                Archive
                            </Button>
                        </Permission>
                    </div>
                </HeaderBar>

                {this.renderRoleInfo()}
                {this.renderNavigationTabs()}
                {this.renderNavigationTabContents()}
            </div>
        );
    }

    private editRole(): void {
        this.props.routingStore.push(routing.getUrl('roles.roles.edit', { role: this.props.roleStore.id }));
    }

    private archiveRole(): void {
        confirmationPopupService.show(
            'Archive',
            `Are you sure you would like to archive user group ${this.props.roleStore.name}?`,
        ).then((answer: ConfirmationPopupValues) => {
            if (answer === ConfirmationPopupValues.Confirm) {
                this.props.roleStore.archiveRole();
            }
        });
    }

    private renderRoleInfo(): React.ReactElement {
        return (
            <div className='w-100 detailsSection roleInfo'>
                <div className='content w-100'>
                    <Row>
                        <Col sm={4}>
                            {this.renderRow('Name', this.props.roleStore.name)}
                        </Col>
                        <Col sm={4}>
                            {this.renderRow('Status', 'Active')}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    private renderNavigationTabs(): React.ReactElement {
        return (
            <Nav tabs>
                { this.navigation.map((navItem, index) => {
                    return (
                        <NavItem key={ navItem.name }>
                            <NavLink
                                className={ classNames({ active: this.props.roleStore.activeTab === index.toString() })}
                                onClick={ (): void => { this.props.roleStore.setActiveTab(index.toString()); } }
                            >
                                {navItem.name}
                            </NavLink>
                        </NavItem>
                    )
                }) }
            </Nav>
        );
    }

    private renderNavigationTabContents(): React.ReactElement {
        return (
            <TabContent activeTab={this.props.roleStore.activeTab}>
                {this.navigation.map((navItem, index) => {
                    return (
                        <TabPane tabId={ index.toString() } key={ navItem.name }>
                            <Row>
                                <Col sm='12'>
                                    {navItem.render()}
                                </Col>
                            </Row>
                        </TabPane>
                    )
                })}
            </TabContent>
        );
    }

    private renderNotificationSettings(): React.ReactElement {
        return (
            <></>
        )
    }

    private renderPermissionsGrid(): React.ReactElement {
        return (
            <div className='permissionsSection'>
                <Row>
                    <Col sm={6}>
                        <Table className='permission-grid' responsive>
                            <thead>
                                <tr>
                                    <th className='column-collapse' />
                                    <th className='column-name'>Permission Name</th>
                                    <th className='column-checkbox'>On/Off</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.roleStore.permissionList.map((group, index) => this.renderBody(group, index))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>)
    }

    public renderPermission(permission: IPermissionData, rowStripeClass: string): React.ReactElement {
        return (<tr className={rowStripeClass} key={permission.name}>
            <th className='permission column-collapse' />
            <th className='permission column-name'>{permission.name}</th>
            <th className='permission column-checkbox'>
                <input type='checkbox' value={permission.value} disabled={true} checked={this.props.roleStore.isPermissionEnabled(permission.value)} />
            </th>
        </tr>);
    }

    public renderBody(group: IPermissionsData, index: number): React.ReactElement {
        const rowStripeClass = index % 2 == 0 ? 'odd-row' : 'even-row';
        return (
            <>
                <tr className={rowStripeClass} key={index}>
                    <th className='column-collapse' onClick={(): void => this.props.roleStore.toggleGroupCollapse(group)}>
                        <img src={group.isExpanded ? collapse : expand} className='collapseIcon' alt='' />
                    </th>
                    <th className='column-name'>{group.name}</th>
                    <th className='column-checkbox'>
                        <input type='checkbox' value={group.name} disabled={true}
                            checked={this.props.roleStore.isPermissionGroupFullSelected(group)} />
                    </th>
                </tr>
                {group.isExpanded
                    ? group.permissions.map((permission: IPermissionData) => this.renderPermission(permission, rowStripeClass))
                    : <></>
                }
            </>
        )
    }

    private renderRow(title: string, value: string | number): React.ReactElement {
        return (
            <Row className='infoRow'>
                <Col sm={4}>
                    <span className='title'>{title}</span>
                </Col>
                <Col sm={8}>
                    <span className='value'>{value}</span>
                </Col>
            </Row>
        );
    }
}

export default RoleView;
