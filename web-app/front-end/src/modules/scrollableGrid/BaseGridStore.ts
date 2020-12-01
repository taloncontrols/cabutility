import { IBaseGridStore, IGridItem, SortOrder } from './BaseGrid';
import { action, observable } from 'mobx';
import FiltersStore from '../filters/FiltersStore';
import { Filters } from '../filters/FiltersBody';

export interface IDataService<ItemType> {
    loadMoreItems(data: IBaseGridRequestData<ItemType>): Promise<IDataResponse<ItemType>>;
}

export interface IDataResponse<ItemType> {
    data: ItemType[];
}

export interface IBaseGridRequestData<ItemType> {
    sortField?: keyof ItemType;
    sortOrder?: SortOrder;
    filters?: Filters<ItemType>;
    search?: string;
}

export default abstract class BaseGridStore<ItemType extends IGridItem>  extends FiltersStore<ItemType> implements IBaseGridStore<ItemType> {
    @observable public data: ItemType[] = [];
    @observable public totalCount = 0;
    @observable public hovered: string;
    @observable public sortField: keyof ItemType;
    @observable public sortOrder: SortOrder = SortOrder.DESC;

    constructor(defaultFilters: Filters<ItemType>, protected dataService: IDataService<ItemType>) {
        super(defaultFilters);
    }

    public abstract loadMoreItems(): Promise<ItemType[]>;

    @action
    public setFilter(fieldName: keyof ItemType, value: string | boolean): void {
        this.filters[fieldName] = value;
        this.refreshData();
    }

    @action
    public removeFilter(fieldName: keyof ItemType): void {
        delete this.filters[fieldName];
        this.refreshData();
    }

    @action
    public setSort(fieldName: keyof ItemType, order: SortOrder): void {
        this.sortField = fieldName;
        this.sortOrder = order;
        this.refreshData();
    }

    @action
    public refreshData(): void {
        this.data = [];
        this.loadMoreItems();
    }

    @action
    public setHovered(hovered: string): void {
        this.hovered = hovered;
    }

    protected getRequestData(): IBaseGridRequestData<ItemType> {
        const data: IBaseGridRequestData<ItemType> = {};

        if (this.sortField && this.sortOrder) {
            data.sortField = this.sortField;
            data.sortOrder = this.sortOrder;
        }

        const filtersRequestData = this.requestData;

        return { ...data, ...filtersRequestData };
    }
}
