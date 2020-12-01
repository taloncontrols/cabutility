import * as React from 'react';
import './headerBar.scss';

interface IHeaderBarProps {
    children: React.ReactNode;
}

const HeaderBar = (props: IHeaderBarProps): React.ReactElement => {
    return (
        <div className='headerBar'>
            { props.children }
        </div>
    );
}

export default HeaderBar;
