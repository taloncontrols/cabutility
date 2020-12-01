import * as React from 'react';
import {Route, Switch} from 'react-router';

import * as routing from '../routing/routing';

import { CabinetStore }  from './CabinetStore';
import Cabinet from './Cabinet';

const ALERT_COUNT_PER_LOAD = 20;

const store = new CabinetStore();

const CabinetIndex = (): React.ReactElement => {
    return (
        <div className='user w-100 h-100'>
            <Switch>
                <Route path={routing.getUrl('cabinet')}>
                    <Cabinet store={store}/>
                </Route>
               
            </Switch>
        </div>
    );
}

export default CabinetIndex;
