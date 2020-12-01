import * as React from 'react';
import HeaderBar from '../bars/HeaderBar';
import UserStore, { IUserData, Status } from './UserStore';
import DetailsSection from '../layout/DetailsSection';
import { Button, Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import './user.scss';
import { RouterStore } from 'mobx-react-router';
import { InputType } from 'reactstrap/lib/Input';
import * as _ from 'lodash';
import RolesStore, { IUserRole } from '../roles/RolesStore';

export interface IEditableUserProps {
    userStore?: UserStore;
    routingStore?: RouterStore;
    rolesStore?: RolesStore;
}

interface IOption {
    name: string;
}

abstract class BaseEditableUser<T extends IEditableUserProps> extends React.Component<T> {
    public componentDidMount(): void {
        this.props.userStore.emptyStore();
    }

    public render(): React.ReactElement {
        return (
            <div className='w-100 h-100'>
                <HeaderBar>
                    <h2 className='float-left'>{this.props.userStore.fullName}</h2>
                    <div className='float-right'>
                        { this.renderActionButton() }
                        <Button color='primary' outline={ true } onClick={(): void => this.cancel()}>
                            Cancel
                        </Button>
                    </div>
                </HeaderBar>

                { this.renderProfileDetails() }
                { this.renderAuthenticationDetails() }
            </div>
        );
    }

    protected abstract renderActionButton(): React.ReactNode;
    protected abstract shouldRenderReadonlyFields(): boolean;

    protected cancel(): void {
        this.props.routingStore.goBack();
    }

    private renderProfileDetails(): React.ReactElement {
        return (
            <DetailsSection title='Profile details' noBorder={true}>
                <Row>
                    <Col sm={4}>
                        { this.renderInputRow('First name', this.props.userStore.firstName, 'firstName', (value: string ) => this.props.userStore.setFirstName(value)) }
                        { this.renderInputRow('Last name', this.props.userStore.lastName, 'lastName', (value: string ) => this.props.userStore.setLastName(value)) }
                        { this.renderInputRow('Job title', this.props.userStore.jobTitle, 'jobTitle', (value: string ) => this.props.userStore.setJobTitle(value)) }
                        { this.renderInputRow(
                            'Role',
                            this.props.userStore.role,
                            'role',
                            (value: string ) => this.props.userStore.setRole(value),
                            'select',
                            true,
                            this.props.rolesStore.data.filter((role: IUserRole): boolean => role.isActive ))
                        }
                    </Col>
                    <Col sm={4}>
                        { this.renderReadonlyProfileDetails() }
                    </Col>
                </Row>
            </DetailsSection>
        );
    }

    private renderReadonlyProfileDetails(): React.ReactElement {
        if (this.shouldRenderReadonlyFields()) {
            return (
                <div>
                    { this.renderRow('Email', this.props.userStore.email) }
                    { this.renderRow('Phone', this.props.userStore.phoneNumber) }
                    { this.renderRow('Status', this.props.userStore.isActive ? _.upperFirst(Status.Active) : _.upperFirst(Status.Inactive)) }
                </div>
            );
        }
        return;
    }

    private renderAuthenticationDetails(): React.ReactElement {
        return (
            <DetailsSection title='Authentication details'>
                <Row>
                    <Col sm={4}>
                        { this.renderInputRow('Username', this.props.userStore.userName, 'userName', (value: string ) => this.props.userStore.setUserName(value)) }
                        { this.renderInputRow('Password', this.props.userStore.password, 'password', (value: string ) => this.props.userStore.setPassword(value), 'password') }
                        {/*TODO: rfidCardNumber*/}
                        { this.renderReadonlyAuthenticationDetailsSection1() }
                    </Col>
                    <Col sm={4}>
                        {/*TODO: fingerprints*/}
                        { this.renderReadonlyAuthenticationDetailsSection2() }
                    </Col>
                </Row>
            </DetailsSection>
        );
    }

    private renderReadonlyAuthenticationDetailsSection1(): React.ReactElement {
        if (this.shouldRenderReadonlyFields()) {
            return this.renderRow('RFID card number', this.props.userStore.rfidCardNumber);
        }
        return;
    }

    private renderReadonlyAuthenticationDetailsSection2(): React.ReactElement {
        if (this.shouldRenderReadonlyFields()) {
            return this.renderRow('Fingerprints', this.props.userStore.fingerprintsCount);
        }
        return;
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

    private renderInputRow<T extends IOption>(
        title: string, value: string | number,
        name: keyof IUserData,
        onChange: (value: string) => void,
        type: InputType = 'text',
        required = true,
        options?: T[],
    ): React.ReactElement {
        return (
            <FormGroup row required={ required }>
                <Label for={ name } sm={ 4 }>{ title }</Label>
                <Col sm={ 8 }>
                    { this.renderInput(title, value, name, onChange, type, required, options) }
                    { this.renderErrors(name) }
                </Col>
            </FormGroup>
        );
    }

    private renderErrors(fieldName: keyof IUserData): React.ReactNodeArray {
        const errors = this.props.userStore.errors[fieldName];

        if (!errors) {
            return;
        }

        return errors.map((error, index) => {
            return <FormFeedback key={index}>{ error }</FormFeedback>;
        });
    }

    private renderInput<T extends IOption>(
        title: string,
        value: string | number,
        name: keyof IUserData,
        onChange: (value: string) => void,
        type: InputType,
        required: boolean,
        options?: T[],
    ): React.ReactElement {
        const hasError = this.props.userStore.hasError(name);

        if (type !== 'select') {
            return <Input
                type={type}
                name={name}
                id={name}
                placeholder={title}
                value={value}
                required={required}
                onChange={({ currentTarget: { value } }): void => onChange(value)}
                invalid={hasError}
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
                invalid={hasError}
            >
                { optionElements }
            </Input>
        );
    }
}

export default BaseEditableUser;
