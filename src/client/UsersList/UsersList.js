import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_USERS_COUNT = gql`
query {
    usersCount
  }
`;

const GET_USERS_LIST = gql`
    query GetUsersList($after: String) {
        users(after: after) {
            hasMore
            users {
                name
            }
        }   
    }
`
;
const UsersList = props => {
    const { data, loading, error, fetchMore } = useQuery(GET_USERS_LIST);
    console.log("ERROR",error)
    if (loading) return <span>Loading</span>
    if (error) return <span>{error.toString()}</span>

    return (
        <ul>
            {data.users.users.map(user =>(
                <li key={user.name}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}

export default UsersList;