import * as React from 'react';
import * as _ from 'lodash';
import HeaderBar from '../bars/HeaderBar';
import UserStore, { Status } from './UserStore';
import { inject, observer } from 'mobx-react';
import DetailsSection from '../layout/DetailsSection';
import { Button, Col, Row } from 'reactstrap';
import './user.scss';
import { RouterStore } from 'mobx-react-router';
import confirmationPopupService from '../popup/confirmationPopupService';
import { ConfirmationPopupValues } from '../popup/ConfirmationPopupStore';
import * as routing from '../routing/routing';
import Permission from '../permissions/Permission';
import { PermissionValue } from '../permissions/config';

interface IUserViewProps {
    userId: string;
    userStore?: UserStore;
    routingStore?: RouterStore;
}

@inject('routingStore', 'userStore')
@observer
class UserView extends React.Component<IUserViewProps> {
    public componentDidMount(): void {
        this.props.userStore.setId(this.props.userId);
    }

    public render(): React.ReactElement {
        return (
            <div className='w-100 h-100'>
                <HeaderBar>
                    <h2 className='float-left'>{this.props.userStore.fullName}</h2>
                    <div className='float-right'>
                        <Permission requiredPermissions={[PermissionValue.USER_EDIT]}>
                            <Button
                                color='primary'
                                outline={ true }
                                disabled={!this.props.userStore.isActive}
                                onClick={(): void => this.editUser()}
                            >
                                Edit
                            </Button>
                        </Permission>
                        <Permission requiredPermissions={[PermissionValue.USER_ARCHIVE]}>
                            <Button
                                color='primary'
                                outline={ true }
                                disabled={!this.props.userStore.isActive}
                                onClick={(): void => this.deactivateUser()}
                            >
                                Archive
                            </Button>
                        </Permission>
                    </div>
                </HeaderBar>

                { this.renderProfileDetails() }
                { this.renderAuthenticationDetails() }
            </div>
        );
    }

    private deactivateUser(): void {
        confirmationPopupService.show(
            'Archive',
            `Are you sure you would like to archive user ${this.props.userStore.fullName}?`,
        ).then((answer: ConfirmationPopupValues) => {
            if (answer === ConfirmationPopupValues.Confirm) {
                this.props.userStore.deactivate();
            }
        });
    }

    private editUser(): void {
        this.props.routingStore.push(routing.getUrl('users.user.edit', { user: this.props.userStore.id }));
    }

    private renderProfileDetails(): React.ReactElement {
        return (
            <DetailsSection title='Profile details' noBorder={true}>
                <Row>
                    <Col sm={4}>
                        { this.renderRow('First name', this.props.userStore.firstName) }
                        { this.renderRow('Last name', this.props.userStore.lastName) }
                        { this.renderRow('Job title', this.props.userStore.jobTitle) }
                        { this.renderRow('Role', this.props.userStore.role) }
                    </Col>
                    <Col sm={4}>
                        { this.renderRow('Email', this.props.userStore.email) }
                        { this.renderRow('Phone', this.props.userStore.phoneNumber) }
                        { this.renderRow('Status', this.props.userStore.isActive ? _.upperFirst(Status.Active) : _.upperFirst(Status.Inactive)) }
                    </Col>
                </Row>
            </DetailsSection>
        );
    }

    private renderAuthenticationDetails(): React.ReactElement {
        return (
            <DetailsSection title='Authentication details'>
                <Row>
                    <Col sm={4}>
                        { this.renderRow('Username', this.props.userStore.userName) }
                        { this.renderRow('Password', '') }
                        { this.renderRow('RFID card number', this.props.userStore.rfidCardNumber) }
                    </Col>
                    <Col sm={4}>
                        { this.renderRow('Fingerprints', this.props.userStore.fingerprintsCount) }
                    </Col>
                </Row>
            </DetailsSection>
        );
    }

    private renderRow(title: string, value: string | number): React.ReactElement {
        return (
            <Row className='infoRow'>
                <Col sm={4}>
                    <span className='title'>{ title }</span>
                </Col>
                <Col sm={8}>
                    <span className='value'>{ value }</span>
                </Col>
            </Row>
        );
    }
}

export default UserView;
