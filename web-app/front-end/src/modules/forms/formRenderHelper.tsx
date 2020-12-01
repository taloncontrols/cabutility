import * as React from 'react';
import { Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import WithValidationStore from '../validation/WithValidationStore';

export interface IOption {
    name: string;
}

export function renderRow(title: string, value: string | number): React.ReactElement {
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

export function renderErrors<StoreItemType>(store: WithValidationStore<StoreItemType>, fieldName: keyof StoreItemType): React.ReactNodeArray {
    const errors = store.errors[fieldName];

    if (!errors) {
        return;
    }

    return errors.map((error, index) => {
        return <FormFeedback key={index}>{ error }</FormFeedback>;
    });
}

export function renderInput<OptionType extends IOption, StoreItemType>(
    store: WithValidationStore<StoreItemType>,
    title: string,
    value: string | number,
    name: keyof StoreItemType,
    onChange: (value: string) => void,
    type: InputType,
    required: boolean,
    options?: OptionType[],
): React.ReactElement {
    const hasError = store.hasError(name);

    if (type !== 'select') {
        return <Input
            type={type}
            name={name as string}
            id={name as string}
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

    const optionElements = options.map((option: OptionType) => {
        return <option key={option.name}>{option.name}</option>
    });

    return (
        <Input
            type='select'
            name={name as string}
            id={name as string}
            placeholder={title}
            value={value}
            onChange={({ currentTarget: { value } }): void => onChange(value)}
            invalid={hasError}
        >
            { optionElements }
        </Input>
    );
}

export function renderInputRow<OptionType extends IOption, StoreItemType>(
    store: WithValidationStore<StoreItemType>,
    title: string, value: string | number,
    name: keyof StoreItemType,
    onChange: (value: string) => void,
    type: InputType = 'text',
    required = true,
    options?: OptionType[],
): React.ReactElement {
    return (
        <FormGroup row required={ required }>
            <Label for={ name as string } sm={ 4 }>{ title }</Label>
            <Col sm={ 8 }>
                { renderInput<OptionType, StoreItemType>(store, title, value, name, onChange, type, required, options) }
                { renderErrors<StoreItemType>(store, name) }
            </Col>
        </FormGroup>
    );
}
