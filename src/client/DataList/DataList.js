import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_USER_DATA = gql`
    query GetUserData($after: Int) {
        getUserData(after: $after) {
            cursor
            hasMore
            ownerUserId
            data {
                text
                number
            }
        }
    }
`;

const DataList = props => {
    const { data, loading, error, fetchMore } = useQuery(GET_USER_DATA);
    const dataList = (loading ? null : data.getUserData && data.getUserData.data) || [];
    const loadMoreData = () => fetchMore({
        variables: {
            after: data.getUserData.cursor,
        },
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
            console.log("fetchMore",prev, fetchMoreResult, rest)
            if (!fetchMoreResult)
                return prev;
            
            const newUserData = fetchMoreResult.getUserData;
            return {
                getUserData: {
                    ...newUserData,
                    data: [
                        ...prev.getUserData.data,
                        ...newUserData.data,
                    ]
                }
            };
        }
    });
    console.log(data)
    return (
        <React.Fragment>
            <h1>Data List</h1>
            {loading && (
                <span>Loading...</span>
            )}
            {error && (
                <span>Error: {}</span>
            )}
            {!error && !loading && (
                <React.Fragment>
                    <ol>
                        {dataList.map((e, i) => (
                            <li key={i}>
                                {e.text} {e.number}
                            </li>
                        ))}
                    </ol>
                    <button onClick={loadMoreData}>Get more</button>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default DataList;