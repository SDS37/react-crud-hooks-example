import React, { useEffect, useState , useRef } from 'react';
import PropTypes from 'prop-types';

import { getIceCream, postMenuItem } from '../data/iceCreamData';

import Main from '../structure/Main';
import LoaderMessage from '../structure/LoaderMessage';
import IceCream from './IceCream';

const AddIceCream = ({ history, location }) => {
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [iceCream, setIceCream] = useState({});

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getIceCream(location.search.split('=')[1])
      .then(iceCreamResponse => {
        if (isMounted.current) {
          setIceCream(iceCreamResponse);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (err.response.status === 404 && isMounted) {
          history.replace('/', { focus: true });
        }
      });
  }, [history, location.search]);

  const onSubmitHandler = menuItem => {
    postMenuItem(menuItem).then(() => {
      history.push('/', { focus: true });
    });
  };

  return (
    <Main headingText="Add some goodness to the menu">
      <LoaderMessage loadingMessage="Loading ice cream." doneMessage="Ice cream loaded." isLoading={isLoading}/>
      {
        !isLoading && (
          <IceCream iceCream={iceCream} onSubmit={onSubmitHandler} />
        )
      }
    </Main>
  );
};

AddIceCream.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  })
};

export default AddIceCream;
