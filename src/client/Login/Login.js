import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import classes from './Login.css';


const LOGIN_MUTATION = gql`
  mutation Login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      message {
        success
        text
      }
      auth
    }
  }
`;

const Login = props => {
  const client = useApolloClient();
  const [login, { data, loading, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted({ login }) {
        localStorage.setItem('token', login.auth);
        client.writeData({ data: { isLogged: true }});
      }
    }
  );
  const [userName, setUserName] = useState('testUser');
  const [password, setPassword] = useState('test123'); //TODO remove those values later on

  const handleLogin = event => {
    event.preventDefault();
    login({ variables: {
      name: userName,
      password,
    } });
  }

  return (
    <form className={classes.mainForm} onSubmit={handleLogin}>
      <label
        htmlFor="userName"
      >
        User name:
      </label>
      <input
        type="text"
        name="userName"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />
      <label
        htmlFor="password"
      >
        Password:
      </label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        type="submit"
      >
        LOGIN
      </button>
      <div>
        Result:
        {error && (<span>Error occured</span>)}
        {loading && (<span>Loading login data</span>)}
        {data ? <span>Success</span> : <span>Not logged in</span>}
      </div>
    </form>
  );
}

Login.propTypes = {

};

export default Login;