import { action, observable } from 'mobx';
import { IScrollableGridStore } from './ScrollableGrid';
import { Filters } from '../filters/FiltersBody';
import { IGridItem, SortOrder } from './BaseGrid';
import BaseGridStore, { IBaseGridRequestData, IDataResponse, IDataService } from './BaseGridStore';

export interface IScrollableGridDataResponse<ItemType> extends IDataResponse<ItemType> {
    totalCount: number;
}

export interface IScrollableGridDataService<ItemType> extends IDataService<ItemType> {
    loadMoreItems(data: IScrollableGridRequestData<ItemType>): Promise<IScrollableGridDataResponse<ItemType>>;
}

export interface IScrollableGridRequestData<ItemType> extends IBaseGridRequestData<ItemType> {
    count: number;
    startIndex: number;
}

export default class ScrollableGridStore<ItemType extends IGridItem> extends BaseGridStore<ItemType> implements IScrollableGridStore<ItemType> {
    @observable public data: ItemType[] = [];
    @observable public totalCount = 0;
    @observable public hovered: string;
    @observable public sortField: keyof ItemType;
    @observable public sortOrder: SortOrder = SortOrder.DESC;

    constructor(defaultFilters: Filters<ItemType>, protected dataService: IScrollableGridDataService<ItemType>, private countPerPage: number) {
        super(defaultFilters, dataService);
    }

    @action
    public loadMoreItems(): Promise<ItemType[]> {
        const startIndex = this.data.length;

        return this.dataService.loadMoreItems(this.getRequestData()).then(({ data, totalCount}) => {
            data.forEach((item, index) => {
                this.data[index + startIndex] = item;
            })
            this.totalCount = totalCount;

            return data;
        });
    }

    protected getRequestData(): IScrollableGridRequestData<ItemType> {
        return {
            ...super.getRequestData(),
            count: this.countPerPage,
            startIndex: this.data.length,
        };
    }
}
