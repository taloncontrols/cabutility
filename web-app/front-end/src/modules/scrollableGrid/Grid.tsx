import * as React from 'react';
import { Table } from 'reactstrap';
import BaseGrid, { IBaseGridProps, IGridItem } from './BaseGrid';
import { observer } from 'mobx-react';

@observer
export default class Grid<ItemType extends IGridItem> extends BaseGrid<ItemType, IBaseGridProps<ItemType>> {
    public render(): React.ReactElement {
        return (
            <div className='gridContainer'>
                { this.renderHeader() }
                <div className='grid'>
                    <Table striped hover >
                        <tbody>
                            { this.props.store.data.map((item) => {
                                return this.renderRow(item);
                            }) }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }


}
