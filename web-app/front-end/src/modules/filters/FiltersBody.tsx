import * as React from 'react';
import './filtersBody.scss';
import { Button, Input } from 'reactstrap';
import { observer } from 'mobx-react';

enum SelectFilterValues {
    Placeholder = '-1',
    True = '1',
    False = '0',
}

export type Filters<ItemType> = {
    [key in keyof ItemType]?: string | number | boolean | string[] | number[];
}

export interface IFiltersBodyStore<ItemType> {
    filters: Filters<ItemType>;
    setFilterValue(filterName: keyof ItemType, value: string | boolean | number): void;
    refreshData(): void;
    isFiltersVisible: boolean;
}

export enum FiltersConfigType {
    Dropdown = 'Dropdown',
    Boolean = 'Boolean',
    Text = 'Text',
}

interface IFilterConfig<ItemType> {
    label: string;
    fieldName: keyof ItemType;
}

interface IDropDownConfig<ItemType> extends IFilterConfig<ItemType> {
    type: FiltersConfigType.Dropdown;
    values: { id: string; name: string }[];
}

interface IBooleanConfig<ItemType> extends IFilterConfig<ItemType> {
    type: FiltersConfigType.Boolean;
    trueLabel: string;
    falseValue: string;
}

interface ITextConfig<ItemType> extends IFilterConfig<ItemType> {
    type: FiltersConfigType.Text;
}

export type FilterType<ItemType> = IDropDownConfig<ItemType> | IBooleanConfig<ItemType> | ITextConfig<ItemType>;

interface IFiltersBodyProps<ItemType> {
    store: IFiltersBodyStore<ItemType>;
    filtersConfig: FilterType<ItemType>[];
}

@observer
export default class FiltersBody<ItemType> extends React.Component<IFiltersBodyProps<ItemType>> {
    public render(): React.ReactElement {
        if (!this.props.store.isFiltersVisible) {
            return <div />;
        }

        return (
            <div className='filtersBody w-100'>
                <div className='label'>
                    Filter by:
                </div>
                { this.renderFilters() }
                <Button outline color='light' size='sm' onClick={ (): void => this.props.store.refreshData() }>Apply</Button>
            </div>
        );
    }

    private renderFilters(): React.ReactNodeArray {
        return this.props.filtersConfig.map((filter: FilterType<ItemType>) => {
            return this.renderFilter(filter);
        });
    }

    private renderFilter(filter: FilterType<ItemType>): React.ReactElement {
        switch (filter.type) {
        case FiltersConfigType.Boolean: return this.renderBooleanFilter(filter);
        case FiltersConfigType.Dropdown: return this.renderDropdownFilter(filter);
        default: return this.renderTextFilter(filter);
        }
    }

    private renderBooleanFilter(filter: IBooleanConfig<ItemType>): React.ReactElement {
        const filterValue: boolean | undefined = this.props.store.filters[filter.fieldName] as (boolean | undefined);
        const value = this.getBooleanSelectValue(filterValue);

        return (
            <Input
                key={ filter.fieldName as string }
                type='select' bsSize='sm'
                value={ value }
                onChange={ (event): void => this.setBooleanSelectValue(filter.fieldName, (event.target.value as unknown) as SelectFilterValues) }
            >
                <option value={ SelectFilterValues.Placeholder } className='placeholderLabel'>{ filter.label }</option>
                <option value={ SelectFilterValues.True }>{ filter.trueLabel }</option>
                <option value={ SelectFilterValues.False }>{ filter.falseValue }</option>
            </Input>
        );
    }

    private getBooleanSelectValue(value?: boolean): SelectFilterValues {
        if (value === undefined) {
            return SelectFilterValues.Placeholder;
        }

        if (value) {
            return SelectFilterValues.True;
        }

        return SelectFilterValues.False;
    }

    private setBooleanSelectValue(filterName: keyof ItemType, value: SelectFilterValues): void {
        const formattedValue = value === SelectFilterValues.True;

        this.props.store.setFilterValue(filterName, formattedValue);
    }

    private renderTextFilter(filter: ITextConfig<ItemType>): React.ReactElement {
        const value  = this.props.store.filters[filter.fieldName] === undefined ?
            '' :
            this.props.store.filters[filter.fieldName] as string;

        return <Input
            key={ filter.fieldName as string }
            type='text'
            value={ value }
            bsSize='sm'
            placeholder={ filter.label }
            onChange={ (event): void => {
                this.props.store.setFilterValue(filter.fieldName, event.target.value)
            }}
        />;
    }

    private renderDropdownFilter(filter: IDropDownConfig<ItemType>): React.ReactElement {
        const value = this.props.store.filters[filter.fieldName] === undefined ?
            SelectFilterValues.Placeholder :
            this.props.store.filters[filter.fieldName] as string;

        return (
            <Input
                type='select'
                key={ filter.fieldName as string}
                bsSize='sm'
                placeholder={ filter.label }
                onChange={ (event): void => {
                    this.props.store.setFilterValue(filter.fieldName, event.target.value)
                }}
                value={ value }
            >
                <option value={ SelectFilterValues.Placeholder } className='placeholderLabel'>{ filter.label }</option>
                { this.renderDropdownValues(filter) }
            </Input>
        );
    }

    private renderDropdownValues(filter: IDropDownConfig<ItemType>): React.ReactNodeArray {
        return filter.values.map(({ id, name }) => {
            return <option key={ id } value={ id }>{ name }</option>;
        });
    }
}
