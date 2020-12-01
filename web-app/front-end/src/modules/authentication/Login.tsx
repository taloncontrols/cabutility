import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col, FormText } from 'reactstrap';
import { RouterStore } from 'mobx-react-router';
import './login.scss';
import { AuthenticationStoreClass } from './AuthenticationStore';
import logo from '../../static/images/light_logo.svg';
import BottomCredentials from '../layout/BottomCredentials';

interface ILoginProps {
    authenticationStore?: AuthenticationStoreClass;
    routingStore?: RouterStore;
}

@inject('authenticationStore', 'routingStore')
@observer
export default class Login extends React.Component<ILoginProps> {
    public render(): React.ReactElement {
        return (
            <div className='h-100 w-100 loginContainer'>
                <div className='sidebar'>
                    <div className='logoContainer'>
                        <div className='empty' />
                        <img src={logo} className='logo' alt='' />
                        <div className='empty' />
                    </div>

                    <div className='formContainer'>
                        { this.renderForm() }
                    </div>

                    { this.renderBottomCreds() }
                </div>
                <div className='overlay' />
            </div>
        );
    }

    private renderForm(): React.ReactElement {
        const offsetSize = 2;
        const labelSize = 2;
        const inputSize = 6;
        return (
            <Form>
                <FormGroup row>
                    <Col sm={ offsetSize } />
                    <Label for='username' sm={labelSize}>Username</Label>
                    <Col sm={inputSize}>
                        <Input
                            name='username'
                            id='username'
                            placeholder='Username'
                            onChange={({ currentTarget: { value } }): void => this.props.authenticationStore.setUsername(value)}
                            invalid={!!this.props.authenticationStore.errorMessage}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={offsetSize} />
                    <Label for='password' sm={labelSize}>Password</Label>
                    <Col sm={inputSize}>
                        <Input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='Password'
                            onChange={({ currentTarget: { value } }): void => this.props.authenticationStore.setPassword(value)}
                            invalid={!!this.props.authenticationStore.errorMessage}
                        />
                        { this.renderFormFeedback() }
                    </Col>
                </FormGroup>
                <Row>
                    <Col sm={labelSize + offsetSize} />
                    <Col sm={inputSize}>
                        <Button color='primary' className='float-right' onClick={(): void => this.authenticate()}>Log In</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    private renderFormFeedback(): React.ReactElement {
        if (this.props.authenticationStore.errorMessage) {
            return (
                <FormFeedback>
                    { this.props.authenticationStore.errorMessage }
                </FormFeedback>
            );
        }

        return <FormText>&nbsp;</FormText>;
    }

    private renderBottomCreds(): React.ReactElement {
        return <BottomCredentials />;
    }

    private authenticate(): void {
        this.props.authenticationStore.authenticate()
            .then(() => this.props.routingStore.push('/'));
    }
}
