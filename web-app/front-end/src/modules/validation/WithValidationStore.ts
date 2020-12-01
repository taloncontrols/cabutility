import { action, observable } from 'mobx';
import * as _ from 'lodash';

type ValidationErrors<T> = {
    [key in keyof T]?: string[];
}

interface IFormattedMessagePlaceholderValues {
    PropertyName: string;
    PropertyValue: string;
}

interface IError<T> {
    PropertyName: keyof T;
    ErrorMessage: string;
    AttemptedValue: string;
    FormattedMessagePlaceholderValues?: IFormattedMessagePlaceholderValues;
}

interface IErrorResponseData<T> {
    Errors: IError<T>[];
}

class WithValidationStore<T> {
    @observable errors: ValidationErrors<T> = {};

    @action
    public setErrors(errors: IError<T>[]): void {
        this.errors = {};

        errors.forEach((error) => {
            // We need to translate to lower ass we getting from server name started from upper letter
            const propertyName: keyof T = _.lowerFirst(error.PropertyName as string) as keyof T;

            this.errors[propertyName] = this.errors[propertyName] ? this.errors[propertyName] : [];
            this.errors[propertyName].push(error.ErrorMessage);
        });
    }

    public hasError(fieldName: keyof T): boolean {
        return !!this.errors[fieldName] && !!this.errors[fieldName].length;
    }

    protected processErrorResponse(response: IErrorResponseData<T>): void {
        this.setErrors(response.Errors);
    }
}

export default WithValidationStore;
