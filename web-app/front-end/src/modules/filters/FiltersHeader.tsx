import * as React from 'react';
import * as _ from 'lodash';
import './filtersHeader.scss';
import { Form, FormGroup, Input } from 'reactstrap';
import { Filters } from './FiltersBody';
import hideIcon from '../../static/images/icons/icon_dropdown_hide.svg';
import showIcon from '../../static/images/icons/icon_dropdown_show.svg';
import resetIcon from '../../static/images/icons/icon_reset.svg';
import { observer } from 'mobx-react';

export interface IFiltersHeaderStore<ItemType> {
    search: string;
    isFiltersVisible: boolean;
    setSearch(value: string): void;
    filters: Filters<ItemType>;
    filtersCount: number;
    resetFilters(): void;
    hideFilters(): void;
    showFilters(): void;
}

interface IFiltersHeaderProps<ItemType> {
    shouldRenderSearch: boolean;
    searchPlaceholder?: string;

    store: IFiltersHeaderStore<ItemType>;
}

@observer
export class FiltersHeader<ItemType> extends React.Component<IFiltersHeaderProps<ItemType>> {
    private readonly ref: React.RefObject<Input>

    public constructor(props: Readonly<IFiltersHeaderProps<ItemType>>) {
        super(props);
        this.ref = React.createRef<Input>();
    }

    public render(): React.ReactElement {
        return (
            <span className='filtersHeader'>
                { this.renderSearch() }
                { this.renderVisibilitySwitcher() }
                { this.renderReset() }
            </span>
        );
    }

    private renderSearch(): React.ReactElement {
        if (!this.props.shouldRenderSearch) {
            return;
        }

        return (
            <Form inline className='float-left' onSubmit={(event): void => event.preventDefault() }>
                <FormGroup inline>
                    <Input
                        type='search'
                        name='search'
                        id='searchFilter'
                        placeholder='Search by keyword'
                        onChange={ (event): void => _.debounce((search): void => this.executeSearchWithDelay(search), 500)(event.target.value) }
                        className='search'
                        bsSize='sm'
                        ref={this.ref}
                    />
                </FormGroup>
            </Form>
        );
    }

    private executeSearchWithDelay(search: string): void {
        this.props.store.setSearch(search);
    }

    private renderVisibilitySwitcher(): React.ReactElement {
        if (this.props.store.isFiltersVisible) {
            return this.renderHideFilters();
        }

        return this.renderShowFilters();
    }

    private renderHideFilters(): React.ReactElement {
        return (
            <div className='float-left action' onClick={ (): void => this.props.store.hideFilters() }>
                <img src={hideIcon} alt='' />
                Hide filters
            </div>
        );
    }

    private renderShowFilters(): React.ReactElement {
        return (
            <div className='float-left action' onClick={ (): void => this.props.store.showFilters() }>
                <img src={showIcon} alt='' />
                Show filters
            </div>
        );
    }

    private renderReset(): React.ReactElement {
        return (
            <div className='float-left action' onClick={ (): void => this.props.store.resetFilters() } >
                <img src={resetIcon} alt='' />
                Reset filters { this.renderFiltersCount() }
            </div>
        );
    }

    private renderFiltersCount(): React.ReactElement {
        const count = this.props.store.filtersCount;

        if (!count) {
            return;
        }

        return (
            <>
                ({ count })
            </>
        );
    }
}
