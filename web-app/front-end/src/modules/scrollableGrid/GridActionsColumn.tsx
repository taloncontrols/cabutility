import * as React from 'react';
import viewIcon from '../../static/images/icons/view.svg';
import editIcon from '../../static/images/icons/edit.svg';
import archiveIcon from '../../static/images/icons/archive.svg';
import './gridActionsColumn.scss';
import { PermissionValue } from '../permissions/config';
import Permission from '../permissions/Permission';

type clickFunction = (item: IItemWithId) => void;

interface IItemWithId {
    id: string;
}

interface IGridActionsProps {
    view: clickFunction;
    edit: clickFunction;
    archive: clickFunction;
    item: IItemWithId;
    hovered: string;

    viewPermission: PermissionValue;
    editPermission: PermissionValue;
    archivePermission: PermissionValue;
}

export default function GridActionsColumn(props: IGridActionsProps): React.ReactElement {
    if (props.hovered !== props.item.id) {
        return <></>;
    }

    return (
        <div className='gridActionsColumn'>
            <Permission requiredPermissions={[props.viewPermission]}>
                <div className='actionButton float-left' onClick={(): void => props.view(props.item)}>
                    <img src={ viewIcon } alt='' />
                    <span>View</span>
                </div>
            </Permission>
            <Permission requiredPermissions={[props.editPermission]}>
                <div className='actionButton float-left' onClick={(): void => props.edit(props.item)}>
                    <img src={ editIcon } alt='' />
                    <span>Edit</span>
                </div>
            </Permission>
            <Permission requiredPermissions={[props.archivePermission]}>
                <div className='actionButton float-left' onClick={(): void => props.archive(props.item)}>
                    <img src={ archiveIcon } alt='' />
                    <span>Archive</span>
                </div>
            </Permission>
        </div>
    );
}
