import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { getMenuItem, putMenuItem, deleteMenuItem } from '../data/iceCreamData';

import LoaderMessage from '../structure/LoaderMessage';
import Main from '../structure/Main';
import IceCream from './IceCream';

const EditIceCream = ({ match, history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const [menuItem, setMenuItem] = useState({});
 
  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, [])

  useEffect(() => {
    setIsLoading(true);
    getMenuItem(match.params.menuItemId)
      .then( item => {
        if (isMounted.current) {
          setMenuItem(item);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (err.response.status === 404 && isMounted.current) {
          history.replace('/', {focus: true});
        }
      });
    
  }, [match.params.menuItemId, history]);

  const onSubmitHandler = updatedItem => {
    putMenuItem({ id: menuItem.id, ...updatedItem }).then(() => {
      history.push('/', { focus: true });
    });
  };

  const onDeleteHandler = () => {
    deleteMenuItem(match.params.menuItemId).then(() => {
      history.replace('/', { focus: true });
    });
  };

  return (
    <Main headingText="Update this beauty">
      <LoaderMessage loadingMessage="Loading ice cream." doneMessage="Ice cream loaded." isLoading={isLoading}/>
      {
        !isLoading && (
          <IceCream
            {...menuItem}
            onDelete={onDeleteHandler}
            onSubmit={onSubmitHandler}
          />
        )
      }
    </Main>
  );
};

EditIceCream.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }),
};

export default EditIceCream;
