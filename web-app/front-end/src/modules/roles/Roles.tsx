import * as React from 'react';
import { inject, observer } from 'mobx-react';
import RolesStore, { IUserRole } from './RolesStore';
import { Filters } from '../filters/FiltersBody';
import HeaderBar from '../bars/HeaderBar';
import { Button } from 'reactstrap';
import { RouterStore } from 'mobx-react-router';
import Grid from '../scrollableGrid/Grid';
import { IColumnDescription } from '../scrollableGrid/BaseGrid';
import GridActionsColumn from '../scrollableGrid/GridActionsColumn';
import GridStatusColumn from '../scrollableGrid/GridStatusColumn';
import confirmationPopupService from '../popup/confirmationPopupService';
import { ConfirmationPopupValues } from '../popup/ConfirmationPopupStore';
import * as routing from '../routing/routing';
import './roles.scss';
import { PermissionValue } from '../permissions/config';
import Permission from '../permissions/Permission';

interface IRolesProps {
    rolesStore?: RolesStore;
    routingStore?: RouterStore;
}

@inject('rolesStore', 'routingStore')
@observer
export default class Roles extends React.Component<IRolesProps> {
    public static getDefaultFilters(): Filters<IUserRole> {
        return {};
    }

    public render(): React.ReactElement {
        return (
            <div className='w-100 h-100'>
                <HeaderBar>
                    <h2 className='float-left'>User Groups</h2>
                    <div className='float-right'>
                        <Permission requiredPermissions={[PermissionValue.ROLE_EDIT]}>
                            <Button color='primary' onClick={(): void => this.createRole()} size='sm'>
                                + Add
                            </Button>
                        </Permission>
                    </div>
                </HeaderBar>

                <div className='rolesContainer w-100'>
                    { this.renderTable() }
                </div>
            </div>
        );
    }

    private createRole(): void {
        this.props.routingStore.push(routing.getUrl('roles.create'));
    }

    private renderTable(): React.ReactElement {
        return (
            <Grid store={ this.props.rolesStore } columns={ this.getColumnsConfig() } />
        );
    }

    private getColumnsConfig(): IColumnDescription<IUserRole>[] {
        return [{
            dataField: 'name',
            text: 'Full name',
            width: '40',
        }, {
            dataField: 'isActive',
            text: 'Status',
            formatter: (role: IUserRole): React.ReactNode => {
                return (<GridStatusColumn item={ role } />);
            },
            width: '10',
        }, {
            dataField: 'id',
            text: 'Actions',
            formatter: (role: IUserRole): React.ReactNode => {
                return (
                    <GridActionsColumn
                        view={(role: IUserRole): void => this.viewRole(role)}
                        edit={(role: IUserRole): void => this.editRole(role)}
                        archive={(role: IUserRole): void => this.archiveRole(role)}
                        item={role}
                        hovered={this.props.rolesStore.hovered}
                        viewPermission={PermissionValue.ROLE_VIEW}
                        editPermission={PermissionValue.ROLE_EDIT}
                        archivePermission={PermissionValue.ROLE_ARCHIVE}
                    />
                );
            },
            width: 'auto',
        }];
    }

    private archiveRole(role: IUserRole): void {
        confirmationPopupService.show(
            'Archive',
            `Are you sure you would like to archive user group ${role.name}?`,
        ).then((answer: ConfirmationPopupValues) => {
            if (answer === ConfirmationPopupValues.Confirm) {
                this.props.rolesStore.archiveRole(role);
            }
        });
    }

    private editRole(role: IUserRole): void {
        this.props.routingStore.push(routing.getUrl('roles.role.edit', { role: role.id }));
    }

    private viewRole(role: IUserRole): void {
        this.props.routingStore.push(routing.getUrl('roles.role', { role: role.id }));
    }
}
