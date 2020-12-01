import * as React from 'react';
import LeftMenu from '../leftMenu/LeftMenu';
import MainContent from './MainContent';
import './layout.scss';

const MainLayout = (): React.ReactElement => {
    return (
        <div className='h-100 mainLayout'>
            <LeftMenu />
            <MainContent />
        </div>
    );
}

export default MainLayout;
