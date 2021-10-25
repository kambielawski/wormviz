import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import DataView from './components/DataView';
import UploadView from './screens/uploadScreen/UploadScreen';
import LoginScreen from './auth/LoginScreen';

function App() {

    return (
        <Router>    
            <Route exact={true} path={'/'} component={DataView} />
            <Route path={'/upload'} component={UploadView} />
            <Route path={'/login'} component={LoginScreen} />
        </Router>
   );
}

export default App;

