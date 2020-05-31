import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { CLIENT_CONSTANTS } from '../../../constants';
import { THE_ODDS_API_KEY } from '../../../apifootball_key';

const SportDetails = props => {
  const params = useParams();
  const [odds, setOdds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  //TODO: replace localStorage with local GraphQL resolver
  const region = localStorage.getItem(CLIENT_CONSTANTS.BOOKMAKER_REGION_KEY_NAME);
  const theOddsApiOddsUrl = `https://api.the-odds-api.com/v3/odds/?apiKey=${THE_ODDS_API_KEY}&sport=${params.sportKey}&region=${region}`

  useEffect(() => {
    const getOdds = async () => {
      setIsLoading(true);
      const a = await fetch(theOddsApiOddsUrl);
      const responseData = await a.json();
      console.log("response",responseData)
      const mappedData = responseData.data.map(e => e.sites.map(s => ({
        time: e.commence_time,
        teams: `${e.teams[0]} vs ${e.teams[1]}`,
        bookmaker: s.site_nice,
        last_update: s.last_update,
        odds: `${s.odds.h2h[0]} : ${s.odds.h2h[1]}` + (s.odds.h2h.length > 2 ? ` : ${s.odds.h2h[2]}` : ''),
      }))).flat(1);
      console.log("mapped",mappedData)
      setOdds(mappedData);
      setIsLoading(false);
      console.log("Done loading odds")
    }

    getOdds();
  }, []);

  return (
    isLoading ? (
      <span>LOADING ODDS</span>
    ) : (
      <table>
        <thead>
          <tr>
            <td>time</td>
            <td>teams</td>
            <td>bookmaker</td>
            <td>last update</td>
            <td>odds</td>
          </tr>
        </thead>
        <tbody>
          {odds.map(odd => (
            <tr key={odd.teams+odd.bookmaker}>
              <td>{odd.time}</td>
              <td>{odd.teams}</td>
              <td>{odd.bookmaker}</td>
              <td>{odd.last_update}</td>
              <td>{odd.odds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

SportDetails.propTypes = {

};

export default SportDetails;