import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import { APIFOOTBALL_KEY, THE_ODDS_API_KEY } from '../../apifootball_key';


const MainPage = props => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [usersCount, setUsersCount] = useState(0);

    const cache = new InMemoryCache();
    const link = new HttpLink({uri: 'http://localhost:4000'});
    const client = new ApolloClient({ cache, link });
    
    const theOddsApiSportsLink = `https://api.the-odds-api.com/v3/sports/?apiKey=${THE_ODDS_API_KEY}`

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            const a = await fetch(`https://apiv2.apifootball.com/?action=get_countries&APIkey=${APIFOOTBALL_KEY}`);
            setData(await a.json());
            setIsLoading(false);
        }
        // Zaktualizuj tytuł dokumentu korzystając z interfejsu API przeglądarki

        const getTheOddsSports = async () => {
          setIsLoading(true);
          const a = await fetch(theOddsApiSportsLink);
          const responseData = await a.json();
          setData(responseData.data);
          setIsLoading(false);
        }

        getTheOddsSports();
        /*fetch(`https://apiv2.apifootball.com/?action=get_countries&APIkey=${APIFOOTBALL_KEY}`).then(
            response => response.json()).then(
            response => setData(response)
        );*/
    }, []);

    client.query({
        query: gql`
          query {
            usersCount
          }
        `,
      }).then(result => setUsersCount(result.data.usersCount));
    
    console.log(data)

    return (
        <React.Fragment>
        {isLoading ? (
            <span>Loading...</span>
        ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    group
                  </th>
                  <th>
                    details
                  </th>
                  <th>
                    title
                  </th>
                  <th>
                    active
                  </th>
                  <th>
                    has_outrights
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map(e => {
                  return (
                    <tr key={e.key}>
                      <td>
                        {e.group}
                      </td>
                      <td>
                        {e.details}
                      </td>
                      <td>
                        {e.title}
                      </td>
                      <td>
                        {e.active.toString()}
                      </td>
                      <td>
                        {e.has_outrights.toString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        )}
        <span>Users count: {usersCount}</span>
        </React.Fragment>
    );
}

MainPage.propTypes = {

};

export default MainPage;