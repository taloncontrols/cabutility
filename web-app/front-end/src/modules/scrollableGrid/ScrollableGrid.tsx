import * as React from 'react';
import { observer } from 'mobx-react';
import './ScrollableGrid.scss';
import { Table } from 'reactstrap';
import * as uuid from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import BaseGrid, { IBaseGridStore, IColumnDescription, IGridItem } from './BaseGrid';

export interface IScrollableGridStore<ItemType> extends IBaseGridStore<ItemType>{
    totalCount: number;
    loadMoreItems(startIndex?: number, stopIndex?: number): Promise<ItemType[]>;
    setFilter(fieldName: keyof ItemType, value: string | boolean): void;
    removeFilter(fieldName: keyof ItemType): void;
}

interface IScrollableGridProps<ItemType> {
    store: IScrollableGridStore<ItemType>;
    columns: IColumnDescription<ItemType>[];
}

@observer
export default class ScrollableGrid<ItemType extends IGridItem> extends BaseGrid<ItemType, IScrollableGridProps<ItemType>> {
    private readonly id: string;

    constructor(props: Readonly<IScrollableGridProps<ItemType>>) {
        super(props);
        this.id = uuid.v4();
    }

    public render(): React.ReactElement {
        return (
            <div className='gridContainer scrollableGridContainer'>
                { this.renderHeader() }
                <div className='grid scrollableGrid' id={ this.id }>
                    <InfiniteScroll
                        next={ (): Promise<ItemType[]> => this.props.store.loadMoreItems() }
                        dataLength={ this.props.store.data.length }
                        hasMore={ this.props.store.data.length < this.props.store.totalCount }
                        loader={ <></> }
                        scrollableTarget={ this.id }
                    >
                        <Table striped hover >
                            <tbody>
                                { this.props.store.data.map((item) => {
                                    return this.renderRow(item);
                                }) }
                            </tbody>
                        </Table>
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}
