import * as React from 'react';
import { Route, Switch } from 'react-router';
import User from '../users/User';
import Role from '../roles/Role';
import BottomBar from '../bars/BottomBar';
import './layout.scss';
import * as routing from '../routing/routing';

function renderUsers(): React.ReactElement {
    return <User />;
}

function renderRoles(): React.ReactElement {
    return <Role />;
}

const MainContent = (): React.ReactElement => {
    return (
        <div className='h-100 mainContent'>
            <div className='content'>
                <Switch>
                    <Route path={routing.getUrl('users')}>
                        { renderUsers() }
                    </Route>
                    <Route path={routing.getUrl('roles')}>
                        { renderRoles() }
                    </Route>
                    <Route path={routing.getUrl('home')}>
                        { renderUsers() }
                    </Route>
                </Switch>
            </div>
            <BottomBar />
        </div>
    );
}

export default MainContent;
