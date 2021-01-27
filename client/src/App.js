import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';


const App = () => (
  <Router>
    <Route path="/login" exact component={Login} />
    <Route path="/chat" component={Chat} />
    <Redirect to="/login" />
  </Router>
);

export default App;