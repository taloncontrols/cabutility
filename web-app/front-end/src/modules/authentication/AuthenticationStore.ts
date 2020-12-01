import { action, observable } from 'mobx';
import * as authenticationDataService from './authenticationDataService';

export class AuthenticationStoreClass {
    @observable tokenType?: string;
    @observable token?: string;
    @observable password: string;
    @observable username: string;
    @observable pin: string;
    @observable errorMessage = '';
    @observable isInErrorState = false;

    constructor() {
        this.token = localStorage.getItem('token');
        this.tokenType = localStorage.getItem('token_type');
    }

    @action
    public setToken(token: string, tokenType: string): void {
        this.token = token;
        this.tokenType = tokenType;

        localStorage.setItem('token', token);
        localStorage.setItem('token_type', tokenType);
    }

    @action
    public resetToken(): void {
        this.token = undefined;
        this.tokenType = undefined;

        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
    }

    @action
    public setErrorMessage(errorMessage: string): void {
        this.errorMessage = errorMessage;
    }

    @action
    public setUsername(username: string): void {
        this.username = username;
    }

    @action
    public setPassword(password: string): void {
        this.password = password;
    }
    @action
    public setPin(pin: string): void {
        this.pin = pin;
    }
    @action
    public logout(): void {
        this.resetToken();
    }

    @action
    public authenticate(): Promise<void> {
        return authenticationDataService.makeAuthenticateRequest(this.username, this.password).then((data) => {
            this.setToken(data.access_token, data.token_type);
            this.setErrorMessage('');
        }).catch(() => {
            this.resetToken();
            this.setErrorMessage('Username or password is incorrect');
            throw new Error('Username or password is incorrect');
        });
    }

    @action
    public authenticateByPin(): Promise<void> {
        return authenticationDataService.makeAuthenticateByPinRequest(this.pin).then((data) => {
            this.setToken(data.access_token, data.token_type);
            this.setErrorMessage('');
        }).catch(() => {
            this.resetToken();
            this.setErrorMessage('Pin is incorrect');
            throw new Error('Pin is incorrect');
        });
    }

    public isValidAuthentication(): Promise<boolean> {
        return authenticationDataService.validateAuthentication()
            .then(() => true)
            .catch(() => {
                return false;
            })
    }
}

export default new AuthenticationStoreClass();
