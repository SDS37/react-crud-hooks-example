import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getMenu } from '../data/iceCreamData';

import LoaderMessage from '../structure/LoaderMessage';
import Main from '../structure/Main';
import IceCreamCardContainer from './IceCreamCardContainer';
import IceCreamCard from './IceCreamCard';

import { css } from 'emotion/macro';
const cardContentStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.3em 0 0 0;

  p {
    margin: 0;
    color: #403147;
  }

  p.price {
    font-size: 1em;
    position: relative;
    margin-right: 1.125em;
    color: rgba(64, 49, 71, 0.8);

    &:after {
      content: '';
      width: 4px;
      height: 4px;
      position: absolute;
      top: 50%;
      margin-top: -3px;
      right: -0.7em;
      background: rgba(64, 49, 71, 0.4);
      border-radius: 50%;
    }
  }

  p.stock {
    font-size: 1em;
    color: rgba(64, 49, 71, 0.8);

    &.out {
      color: #d8474f;
    }
  }

  p.description {
    width: 100%;
    margin-top: 1em;
    line-height: 1.375em;
    color: rgba(64, 49, 71, 0.9);
    font-size: 0.875em;
  }
`;

const Menu = ({history}) => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getMenu().then(menuData => {
      if (isMounted) {
        setMenu(menuData);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <Main headingText="Rock your taste buds with one of these!">
      <LoaderMessage loadingMessage="Ice creams loading" doneMessage="Menu complete" isLoading={isLoading}/>
      { 
        menu.length > 0 ? (
          <IceCreamCardContainer>
            {
              menu.map(({ id, iceCream, price, description, inStock, quantity }) => (
                <IceCreamCard
                  key={id.toString()}
                  iceCreamId={iceCream.id}
                  to={`/menu-items/${id.toString()}`}
                  heading={iceCream.name}
                  history={history}>
                  <div className={cardContentStyle}>
                    <p className="price">{`$${price.toFixed(2)}`}</p>
                    <p className={`stock${inStock ? '' : ' out'}`}>
                      {inStock ? `${quantity} in stock` : 'Currently out of stock!'}
                    </p>
                    <p className="description">{description}</p>
                  </div>
                </IceCreamCard>
              ))
            }
          </IceCreamCardContainer>
        ) : ( !isLoading && <p>nothing to show !</p> )
      }
    </Main>
  );
}

Menu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Menu; 