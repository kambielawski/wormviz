import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import DataView from './components/DataView';
import UploadView from './screens/uploadScreen/UploadScreen';

function App() {

    return (
        <Router>
            <Route exact={true} path={'/'} component={DataView} />
            <Route path={'/upload'} component={UploadView} />
        </Router>
   );
}

export default App;

