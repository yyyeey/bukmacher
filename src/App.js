import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import MainPage from './client/MainPage';
import UsersList from './client/UsersList';
import DataList from './client/DataList';


function App() {
  return (
    <BrowserRouter>
      <img src={logo} className="App-logo" alt="logo" />
      <Link to={'/'}>MainPage</Link>
      <Link to={'/data'}>Data List</Link>
      <Link to={'/users'}>Users List</Link>
      <Switch>

        <Route path={'/data'}>
          <DataList />
        </Route>
        <Route path={'/users'}>
          {/*<UsersList />*/}
        </Route>
        <Route path={'/'}>
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
