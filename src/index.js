import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CLIENT_CONSTANTS } from './constants';

const link = new HttpLink({
  headers: { authorization: localStorage.getItem('token') },
  uri: 'http://localhost:4000'
});
const cache = new InMemoryCache();
const client = new ApolloClient({cache, link})

localStorage.setItem(CLIENT_CONSTANTS.BOOKMAKER_REGION_KEY_NAME, 'uk');

ReactDOM.render(
    <ApolloProvider client={client} >
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
