import { IFiltersHeaderStore } from './FiltersHeader';
import { Filters, IFiltersBodyStore } from './FiltersBody';
import { action, computed, observable } from 'mobx';
import *as _ from 'lodash';

export default abstract class FiltersStore<ItemType> implements IFiltersHeaderStore<ItemType>, IFiltersBodyStore<ItemType> {
    @observable public filters: Filters<ItemType>;
    @observable public search: string;
    @observable public isFiltersVisible = false;

    protected constructor(defaultFilters: Filters<ItemType>) {
        this.filters = defaultFilters;
    }

    public abstract refreshData(): void;

    @action
    public showFilters(): void {
        this.isFiltersVisible = true;
    }

    @action
    public hideFilters(): void {
        this.isFiltersVisible = false;
    }

    @action
    public resetFilters(): void {
        this.filters = {};
        this.refreshData();
    }

    @action
    public setFilterValue(filterName: keyof ItemType, value: string | boolean | number): void {
        this.filters[filterName] = value;
    }

    // use next one only for multiple values filters
    @action
    public addFilterValue(filterName: keyof ItemType, value: string | number): void {
        if (!Array.isArray(this.filters[filterName])) {
            this.filters[filterName] = [];
        }
        (this.filters[filterName] as (string | number)[]).push(value);
        this.refreshData();
    }

    @action
    public setSearch(value: string): void {
        this.search = value;
        this.refreshData();
    }

    @computed({ keepAlive: true })
    public get filtersCount(): number {
        return Object.values(this.filters).filter((value) => value !== undefined && value !== '').length;
    }

    @computed({ keepAlive: true })
    protected get requestData(): { filters?: Filters<ItemType>; search?: string } {
        const requestData: { filters?: Filters<ItemType>; search?: string } = {};

        if (this.filters) {
            const nonEmptyFilters = _.clone(this.filters);

            for (const i in nonEmptyFilters) {
                if (nonEmptyFilters[i] === '') {
                    delete nonEmptyFilters[i];
                }
            }

            requestData.filters = nonEmptyFilters;
        }

        if (this.search) {
            requestData.search = this.search;
        }

        return requestData;
    }
}
