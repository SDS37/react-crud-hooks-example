import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getIceCreams } from '../data/iceCreamData';

import Main from '../structure/Main';
import LoaderMessage from '../structure/LoaderMessage';
import IceCreamCard from './IceCreamCard';
import IceCreamCardContainer from './IceCreamCardContainer';

import { css } from 'emotion/macro';
const paragraphStyle = css`
  max-width: 60%;
  margin: 0 auto;
  padding-bottom: 3em;
`;

const IceCreams = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iceCreams, setIceCreams] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getIceCreams().then(iceCreams => {
      if (isMounted) {
        setIceCreams(iceCreams);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Main headingText="Choose your poison and enjoy!">
      <LoaderMessage loadingMessage="Loading the stock list." doneMessage="Loading stock list complete." isLoading={isLoading}/>
      {
        iceCreams.length > 0 ? (
          <IceCreamCardContainer>
          {
            iceCreams.map(({ id, name }) => (
              <IceCreamCard
                key={id.toString()}
                iceCreamId={id}
                heading={name}
                to={{ pathname: '/menu-items/add', search: `?iceCreamId=${id.toString()}` }}
                history={history}/>
            ))
          }
          </IceCreamCardContainer>
        ) : ( !isLoading && <p className={paragraphStyle}>Your menu is fully stocked!</p> )
      }
    </Main>
  );
};

IceCreams.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default IceCreams;
