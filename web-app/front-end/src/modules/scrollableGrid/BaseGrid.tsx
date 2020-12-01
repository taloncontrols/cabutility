import * as React from 'react';
import { ReactNode } from 'react';
import { Table } from 'reactstrap';
import './baseGrid.scss';

export interface IBaseGridStore<ItemType> {
    data: ItemType[];
    sortField: keyof ItemType;
    sortOrder: SortOrder;
    hovered: string;
    setSort(fieldName: keyof ItemType, order: SortOrder): void;
    setHovered(hovered: string): void;
}

export interface IGridItem {
    id: string;
}

export enum SortOrder {
    ASC='ASC',
    DESC='DESC'
}

interface ICellFormatter<ItemType> {
    (item: ItemType): ReactNode;
}

export interface IColumnDescription<ItemType> {
    sort?: boolean;
    text: string;
    dataField: keyof ItemType;
    formatter?: ICellFormatter<ItemType>;

    // Width is persantage from parent like 10
    width?: string;
}

export interface IBaseGridProps<ItemType> {
    store: IBaseGridStore<ItemType>;
    columns: IColumnDescription<ItemType>[];
}

export default abstract class BaseGrid<ItemType extends IGridItem, PropsType extends IBaseGridProps<ItemType>> extends React.Component<PropsType> {
    public abstract render(): React.ReactElement;

    protected renderHeader(): React.ReactElement {
        return (
            <Table className='headerTable'>
                <thead>
                    <tr>
                        {
                            this.props.columns.map((columnDefinition, index) => {
                                return <th key={ index } className={ this.getWidthClass(columnDefinition) }>{ columnDefinition.text }{this.renderSort(columnDefinition)}</th>
                            })
                        }
                    </tr>
                </thead>
            </Table>
        );
    }

    protected getWidthClass(columnDefinition: IColumnDescription<ItemType>): string {
        return  columnDefinition.width ? `w-${columnDefinition.width}` : '';
    }

    protected renderRow(item: ItemType): React.ReactElement {
        const thElements: ReactNode[] = this.props.columns.map((columnDefinition, index) => {
            return (
                <td key={index} className={ this.getWidthClass(columnDefinition) }>
                    { columnDefinition.formatter ? columnDefinition.formatter(item) : item[columnDefinition.dataField] }
                </td>);
        });

        return (
            <tr
                key={item.id}
                onMouseOver={ (): void => this.props.store.setHovered(item.id) }
                onMouseLeave={ (): void => this.props.store.setHovered('') }
            >
                { thElements }
            </tr>
        );
    }

    private renderSort(columnDefinition: IColumnDescription<ItemType>): React.ReactElement {
        const sortClass = this.getSortOrderClassName(columnDefinition);

        return <span className={sortClass} onClick={(): void => this.changeSort(columnDefinition)} />;
    }

    private getSortOrderClassName(columnDefinition: IColumnDescription<ItemType>): string {
        if (!columnDefinition.sort) {
            return;
        }

        const sortableClassName = 'sortable';
        if (this.props.store.sortField !== columnDefinition.dataField) {
            return sortableClassName;
        }

        if (this.props.store.sortOrder === SortOrder.ASC) {
            return `${sortableClassName} asc`;
        }

        return `${sortableClassName} desc`;
    }

    private changeSort(columnDefinition: IColumnDescription<ItemType>): void {
        if (!columnDefinition.sort) {
            return;
        }

        if (this.props.store.sortField !== columnDefinition.dataField || this.props.store.sortOrder === SortOrder.DESC) {
            this.props.store.setSort(columnDefinition.dataField, SortOrder.ASC);
            return;
        }

        this.props.store.setSort(columnDefinition.dataField, SortOrder.DESC);
    }
}
