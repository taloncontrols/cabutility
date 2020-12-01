import * as React from 'react';
import { observable, autorun } from "mobx"
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import { Route, Switch } from 'react-router';
import MainLayout from './modules/layout/MainLayout';
import Login from './modules/authentication/Login';
import Keypad from './modules/authentication/Keypad';
import CabinetIndex from './modules/hardware/CabinetIndex';

import * as routing from './modules/routing/routing';


interface IAppProps {
    routingStore?: RouterStore;
}

@inject('routingStore')
@observer
export default class App extends React.Component<IAppProps> {
    render(): React.ReactElement {
        return (
            <div >
                <Switch>
                    <Route path={routing.getUrl('keypad')}>
                        <Keypad />
                    </Route>
                    <Route path={routing.getUrl('cabinet')}>
                       {  <CabinetIndex /> }
                    </Route>
                </Switch>
            </div>
        );
    }
}
