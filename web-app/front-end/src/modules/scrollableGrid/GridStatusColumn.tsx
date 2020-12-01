import * as React from 'react';
import './gridSstatusColumn.scss';

interface IItemWithStatus {
    isActive: boolean;
}

interface IGridStatusColumnProps {
    item: IItemWithStatus;
}

const GridStatusColumn = ({ item }: IGridStatusColumnProps): React.ReactElement => {
    if (item.isActive) {
        return <span className='active'>Active</span>;
    }
    return <span className='inactive'>Inactive</span>;
};

export default GridStatusColumn;
