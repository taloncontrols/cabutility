import * as React from 'react';
import './bottomCredentials.scss';

const BottomCredentials = (): React.ReactElement => {
    return (
        <div className='bottom-credentials'>
            <div className='float-left'>
                <span dangerouslySetInnerHTML={{ '__html': '&copy;' }} />
                {new Date().getFullYear()} Talon
            </div>
            <div className='version float-right'>
                Version 1.0.1
            </div>
        </div>
    );
}

export default BottomCredentials;
