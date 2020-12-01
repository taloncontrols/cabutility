import * as React from 'react';
import { Button } from 'reactstrap';
import HeaderBar from '../bars/HeaderBar';
import { RouterStore } from 'mobx-react-router';
import { inject, observer } from 'mobx-react';
import './users.scss';
import UsersStore from './UsersStore';
import { IExistingUserData } from './UserStore';
import ScrollableGrid from '../scrollableGrid/ScrollableGrid';
import { FiltersHeader } from '../filters/FiltersHeader';
import FiltersBody, { FiltersConfigType, FilterType } from '../filters/FiltersBody';
import classNames from 'classnames';
import RolesStore from '../roles/RolesStore';
import { IColumnDescription, SortOrder } from '../scrollableGrid/BaseGrid';
import GridStatusColumn from '../scrollableGrid/GridStatusColumn';
import GridActionsColumn from '../scrollableGrid/GridActionsColumn';
import confirmationPopupService from '../popup/confirmationPopupService';
import { ConfirmationPopupValues } from '../popup/ConfirmationPopupStore';
import * as routing from '../routing/routing';
import Permission from '../permissions/Permission';
import { PermissionValue } from '../permissions/config';

interface IUsersProps {
    routingStore?: RouterStore;
    usersStore: UsersStore;
    rolesStore?: RolesStore;
}

@inject('routingStore', 'rolesStore')
@observer
export default class Users extends React.Component<IUsersProps> {
    public componentDidMount(): void {
        this.props.usersStore.setSort('fullName', SortOrder.ASC);
        this.props.usersStore.refreshData();
    }

    public render(): React.ReactNode {
        return (
            <div className='w-100 h-100 users'>
                <HeaderBar>
                    <h2 className='float-left'>Users</h2>
                    <FiltersHeader shouldRenderSearch={true} store={this.props.usersStore} />
                    <div className='float-right'>
                        <Permission requiredPermissions={[PermissionValue.USER_EDIT]}>
                            <Button color='primary' onClick={(): void => this.createUser()} size='sm'>
                                + Add
                            </Button>
                        </Permission>
                    </div>
                </HeaderBar>

                { this.renderTable() }
            </div>
        );
    }

    private createUser(): void {
        this.props.routingStore.push(routing.getUrl('users.create'));
    }

    private archiveUser(user: IExistingUserData): void {
        confirmationPopupService.show(
            'Archive',
            `Are you sure you would like to archive user ${user.fullName}?`,
        ).then((answer: ConfirmationPopupValues) => {
            if (answer === ConfirmationPopupValues.Confirm) {
                this.props.usersStore.archiveUser(user);
            }
        });
    }

    private editUser(user: IExistingUserData): void {
        this.props.routingStore.push(routing.getUrl('users.user.edit', { user: user.id }));
    }

    private viewUser(user: IExistingUserData): void {
        this.props.routingStore.push(routing.getUrl('users.user', { user: user.id }));
    }

    private renderTable(): React.ReactNode {
        return (
            <div className='usersContainer w-100'>
                <FiltersBody store={ this.props.usersStore } filtersConfig={ this.getFiltersConfig() } />

                <div className={classNames({
                    tableContainer: true,
                    'w-100': true,
                    withFilters: this.props.usersStore.isFiltersVisible,
                })}>
                    <ScrollableGrid store={ this.props.usersStore } columns={ this.getColumnsConfig() } />
                </div>
            </div>
        );
    }

    private getFiltersConfig(): FilterType<IExistingUserData>[] {
        return [{
            type: FiltersConfigType.Text,
            label: 'Full Name',
            fieldName: 'fullName',
        }, {
            type: FiltersConfigType.Text,
            label: 'Job Title',
            fieldName: 'jobTitle',
        }, {
            type: FiltersConfigType.Dropdown,
            label: 'User Group',
            fieldName: 'role',
            values: this.props.rolesStore.data,
        }, {
            type: FiltersConfigType.Boolean,
            label: 'Status',
            fieldName: 'isActive',
            trueLabel: 'Active',
            falseValue: 'Inactive',
        }];
    }

    private getColumnsConfig(): IColumnDescription<IExistingUserData>[] {
        return [{
            dataField: 'fullName',
            text: 'Full name',
            sort: true,
            width: '20',
        }, {
            dataField: 'jobTitle',
            text: 'Job title',
            width: '20',
        }, {
            dataField: 'role',
            text: 'User Group',
            width: '30',
        }, {
            dataField: 'isActive',
            text: 'Status',
            formatter: (user: IExistingUserData): React.ReactNode => {
                return (<GridStatusColumn item={ user } />);
            },
            width: '10',
        }, {
            dataField: 'id',
            text: 'Actions',
            formatter: (user: IExistingUserData): React.ReactNode => {
                return (<GridActionsColumn
                    view={(user: IExistingUserData): void => this.viewUser(user)}
                    edit={(user: IExistingUserData): void => this.editUser(user)}
                    archive={(user: IExistingUserData): void => this.archiveUser(user)}
                    item={user}
                    hovered={this.props.usersStore.hovered}
                    viewPermission={PermissionValue.USER_VIEW}
                    editPermission={PermissionValue.USER_EDIT}
                    archivePermission={PermissionValue.USER_ARCHIVE}
                />);
            },
            width: 'auto',
        }];
    }
}
