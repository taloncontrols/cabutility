import * as React from 'react';
import BottomCredentials from '../layout/BottomCredentials';
import './bottomBar.scss';

const BottomBar = (): React.ReactElement => {
    return (
        <div className='w-100 bottomBar'>
            <BottomCredentials />
        </div>
    );
}

export default BottomBar;
