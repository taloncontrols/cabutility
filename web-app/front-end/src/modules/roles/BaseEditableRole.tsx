import RoleStore, { IRoleData, IPermissionsData, IPermissionData } from './RoleStore';
import { RouterStore } from 'mobx-react-router';
import * as React from 'react';
import HeaderBar from '../bars/HeaderBar';
import { Button, Row, Col, FormGroup, Label, Input, Nav, NavItem, NavLink, TabContent, TabPane, Table } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import classNames from 'classnames';
import collapse from '../../static/images/icons/collapse.svg';
import expand from '../../static/images/icons/expand.svg';

export interface IEditableRoleProps {
    roleStore?: RoleStore;
    routingStore?: RouterStore;
}

export interface INavigationTab {
    name: string;
    render: () => JSX.Element;
}

interface IOption {
    name: string;
}

abstract class BaseEditableRole<T extends IEditableRoleProps> extends React.Component<T> {
    public componentDidMount(): void {
        this.props.roleStore.emptyStore();
    }

    navigation: INavigationTab[] = [
        { name: 'Permissions', render: (): React.ReactElement => this.renderPermissionsGrid() },
        { name: 'Notification Settings', render: (): React.ReactElement => this.renderNotificationSettings() },
    ];

    public render(): React.ReactElement {
        return (
            <>
                <div className='w-100 h-100'>
                    <HeaderBar>
                        <h2 className='float-left'>{this.props.roleStore.name}</h2>
                        <div className='float-right'>
                            {this.renderActionButton()}
                            <Button color='primary' outline={true} onClick={(): void => this.cancel()}>
                                Cancel
                            </Button>
                        </div>
                    </HeaderBar>

                    {this.renderRoleInfo()}
                    {this.renderNavigationTabs()}
                    {this.renderNavigationTabContents()}
                </div>
            </>
        );
    }

    protected abstract renderActionButton(): React.ReactNode;

    protected cancel(): void {
        this.props.routingStore.goBack();
    }

    private renderRoleInfo(): React.ReactElement {
        return (
            <div className='w-100 detailsSection roleInfo' >
                <div className='content w-100'>
                    <Row>
                        <Col sm={4}>
                            {this.renderInputRow('Name', this.props.roleStore.name, 'name', (value: string) => this.props.roleStore.setName(value))}
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
                {this.navigation.map((navItem, index) => {
                    return (
                        <NavItem key={ navItem.name }>
                            <NavLink
                                className={classNames({ active: this.props.roleStore.activeTab === index.toString() })}
                                onClick={(): void => { this.props.roleStore.setActiveTab(index.toString()); }}
                            >
                                {navItem.name}
                            </NavLink>
                        </NavItem>
                    )
                })}
            </Nav>
        );
    }

    private renderNavigationTabContents(): React.ReactElement {
        return (
            <TabContent activeTab={this.props.roleStore.activeTab}>
                {this.navigation.map((navItem, index) => {
                    return (
                        <TabPane tabId={index.toString()} key={ navItem.name }>
                            <Row>
                                <Col sm='12'>
                                    { navItem.render() }
                                </Col>
                            </Row>
                        </TabPane>
                    )
                })}
            </TabContent>
        );
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
                                {this.props.roleStore.permissionList.map((group, index): React.ReactElement => this.renderBody(group, index))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>)
    }

    private renderNotificationSettings(): React.ReactElement {
        return (
            <></>
        )
    }

    public renderPermission(permission: IPermissionData, rowStripeClass: string): React.ReactElement {
        return (<tr className={rowStripeClass}>
            <th className='permission column-collapse' />
            <th className='permission column-name'>{permission.name}</th>
            <th className='permission column-checkbox'>
                <input type='checkbox' value={permission.value}
                    onChange={(e): void => this.props.roleStore.togglePermissionSelectionWithRequired(permission, e.target.checked)}
                    checked={this.props.roleStore.isPermissionEnabled(permission.value)}
                />
            </th>
        </tr>);
    }

    public renderBody(group: IPermissionsData, index: number): React.ReactElement {
        const rowStripeClass = index % 2 == 0 ? 'odd-row' : 'even-row';
        return (
            <>
                <tr className={rowStripeClass}>
                    <th className='column-collapse' onClick={(): void => this.props.roleStore.toggleGroupCollapse(group)}>
                        <img src={group.isExpanded ? collapse : expand} className='collapseIcon' alt='' />
                    </th>
                    <th className='column-name'>{group.name}</th>
                    <th className='column-checkbox'>
                        <input type='checkbox' value={group.name}
                            onChange={(e): void => this.props.roleStore.togglePermissionGroupSelection(group, e.target.checked)}
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

    private renderInputRow<T extends IOption>(
        title: string,
        value: string | number,
        name: keyof IRoleData,
        onChange: (value: string) => void,
        type: InputType = 'text',
        required = true,
        options?: T[],
    ): React.ReactElement {
        return (
            <FormGroup row required={required}>
                <Label for={name} sm={4}>{title}</Label>
                <Col sm={8}>
                    {this.renderInput(title, value, name, onChange, type, required, options)}
                </Col>
            </FormGroup>
        );
    }

    private renderInput<T extends IOption>(
        title: string,
        value: string | number,
        name: keyof IRoleData,
        onChange: (value: string) => void,
        type: InputType,
        required: boolean,
        options?: T[],
    ): React.ReactElement {
        if (type !== 'select') {
            return <Input
                type={type}
                name={name}
                id={name}
                placeholder={title}
                value={value}
                required={required}
                onChange={({ currentTarget: { value } }): void => onChange(value)}
            />;
        }

        if (!options) {
            return;
        }

        const optionElements = options.map((option: T) => {
            return <option key={option.name}>{option.name}</option>
        });

        return (
            <Input
                type='select'
                name={name}
                id={name}
                placeholder={title}
                value={value}
                onChange={({ currentTarget: { value } }): void => onChange(value)}
            >
                {optionElements}
            </Input>
        );
    }
}

export default BaseEditableRole;
