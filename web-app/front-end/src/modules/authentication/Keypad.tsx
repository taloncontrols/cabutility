

import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col, FormText } from 'reactstrap';
import { RouterStore } from 'mobx-react-router';
import './Keypad.scss';
import { AuthenticationStoreClass } from './AuthenticationStore';
import logo from '../../static/images/light_logo.svg';
import BottomCredentials from '../layout/BottomCredentials';

export interface KeypadProps {
    authenticationStore?: AuthenticationStoreClass;
    routingStore?: RouterStore;
}
interface KeyPadState {
    Pin: string;
}
@inject('authenticationStore', 'routingStore')
@observer
export default class Keypad extends React.Component<KeypadProps, KeyPadState> {

    constructor(props: any) {
        super(props);
        this.Pin = "";
        this.state={Pin: ''};
        this.Message = "Enter your PIN to access the cabinet.";
    }
    public render(){
        return (
            <div className="tln-page">
                <div className="tln-sidebar">
                    <img className="tln-logo" src={logo} alt="Talon Controls"></img>

                    <div className='tln-message'>
                        <label>{this.Message}</label>
                       <label>{this.state.Pin}</label>
                    </div>
                    {
                        <div className='tln-button-box'>
                            <button className='tln-btn-secondary'>Contact Us</button>

                            <button className='tln-btn-secondary'>Setup</button>
                        </div>
                    }
                   
                </div>
                { this.renderForm() }
            </div>
        );
     }
    
    private renderForm(): React.ReactElement {
        return (
          
                <div className="tln-keypad">
                    <div className="tln-keypad-row">
                        <button onClick={() => this.Click(1)}>1</button>
                        <button onClick={() => this.Click(2)}>2</button>
                        <button onClick={() => this.Click(3)}>3</button>
                    </div>
                    <div className="tln-keypad-row">
                        <button onClick={() => this.Click(4)}>4</button>
                        <button onClick={() => this.Click(5)}>5</button>
                        <button onClick={() => this.Click(6)}>6</button>
                    </div>
                    <div className="tln-keypad-row">
                        <button onClick={() => this.Click(7)}>7</button>
                        <button onClick={() => this.Click(8)}>8</button>
                        <button onClick={() => this.Click(9)}>9</button>
                    </div>
                    <div className="tln-keypad-row">
                        <button className="tln-keypad-btn-text" onClick={() => this.Clear()}>Clear</button>
                        <button onClick={() => this.Click(0)}>0</button>
                        <button className="tln-keypad-btn-text" onClick={() => this.authenticate()}>Enter</button>
                    </div>

                </div>
           
        );
    }

    private Click(num: number) {
        this.Pin += num.toString();
        // var value='';
        // for (var i=0;i<this.Pin.length;i++){
        //     value+='X';
        // }
        this.setState({Pin: this.state.Pin+'X'});
    }

    private Clear() {
        this.Pin = "";
        this.setState({Pin: ''});
    }

    /* private Enter() {
        console.log("Pin: " + this.Pin);

        if ( this.props.Svc.Login(this.Pin) ) {
            if ( this.props.OnLogin )
                this.props.OnLogin();
        }

    } */
    private authenticate(): void {
        console.log("Pin: " + this.Pin);
        this.props.authenticationStore.setPin(this.Pin);
        this.props.authenticationStore.authenticateByPin()
            .then(() => this.props.routingStore.push('/cabinet'));
    }
    private Pin: string;
    private Message: string;

} // Keypad
