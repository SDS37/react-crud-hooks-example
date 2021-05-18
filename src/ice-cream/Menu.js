// import React, { useState, useEffect } from 'react';
// import Main from '../structure/Main';
// import LoaderMessage from '../structure/LoaderMessage';
// import IceCreamCardContainer from './IceCreamCardContainer';
// import IceCreamCard from './IceCreamCard';
// import { getMenu } from '../data/iceCreamData';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getMenu } from '../data/iceCreamData';

import IceCreamImage from './IceCreamImage';
import LoaderMessage from '../structure/LoaderMessage';

import Helmet from 'react-helmet';

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

const containerStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 1fr;
  grid-gap: 2em;
  list-style: none;
  padding: 0;
  margin: 0;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const mainStyle = css`
  max-width: 63.75em;
  margin-left: auto;
  margin-right: auto;
  min-height: 40em;
  padding-top: 2em;
  padding-bottom: 2em;
  outline: 0;

  .main-heading {
    font-family: 'cornerstone', sans-serif;
    padding: 1rem 0 2rem;
    color: #313030;
    font-size: 1.8em;
    outline: 0;
    text-align: center;
  }
`;


const cardStyle = css`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  height: 100%;
  align-items: center;
  background-color: #ffffff;
  border-radius: 1em;
  cursor: pointer;
  border: 1px solid rgba(32, 33, 36, 0.12);
  background-clip: padding-box;

  transform: translate(0) scale(1, 1);
  transition: all 0.2s ease-in-out;

  @media screen and (max-width: 600px) {
    grid-template-rows: 70% 30%;
  }

  &:hover,
  &:focus-within {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    .text-container {
      h3 {
        a {
          text-decoration: underline;
        }
      }
    }
  }

  &:focus-within {
    box-shadow: 0 0 0 3px #ff71ba, 0 0 0 6px rgba(0, 0, 0, 0.6);

    a {
      outline: 2px solid transparent;
    }
  }

  .text-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    padding: 1.5em;
    height: 100%;

    h3 {
      padding: 0;
      color: #403147;
      font-size: 1.25em;
      line-height: 1.4375em;

      a {
        color: #403147;
        margin-bottom: 1.5em;
        text-decoration: none;
      }
    }

    .content {
    }
  }

  .image-container {
    display: flex;
    align-content: center;
    justify-content: center;
    background-color: #f8f8f8;
    text-align: center;
    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
    padding-top: 3em;
    padding-bottom: 3em;
    height: 100%;
    border-bottom: 1px solid rgba(32, 33, 36, 0.1);

    img {
      max-width: 60%;
    }
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

  const onItemClickHandler = to => {
    history.push(to);
  };

  const onLinkClickHandler = e => {
    //This is done to avoid the click handler of the <li>
    //firing and placing two browse entries in browser history
    e.stopPropagation();
  };

  return (
    <main className={mainStyle}>
      <Helmet><title>Rock your taste buds with one of these | My Ice Cream</title></Helmet>
      <h2>Rock your taste buds with one of these</h2>
      <LoaderMessage loadingMessage="Ice creams loading" doneMessage="Menu complete" isLoading={isLoading}/>
     
      {menu.length > 0 ?
        <ul className={containerStyle}>
          {menu.map( ({id, iceCream, price, description, inStock, quantity}) =>
          <li key={id.toString()}>
            <section className={cardStyle} onClick={()=> {
              onItemClickHandler(`/menu-items/${id.toString()}`);
            }}>
              <div>
                <IceCreamImage iceCreamId={iceCream.id}/>
              </div>
              <div className={cardContentStyle}>
                <h3>
                  <Link to={`/menu-items/${id.toString()}`} onClick={onLinkClickHandler}>{iceCream.name}</Link>
                </h3>
                <p className="price">{`$${price.toFixed(2)}`}</p>
                <p className={`stock${inStock ? '' : ' out'}`}>
                  {inStock ? `${quantity} in stock` : 'Currently out of stock!'}
                </p>
                <p className="description">{description}</p>
              </div>
            </section>
          </li>)}
        </ul>
      : ( !isLoading && <p>nothing to show !</p> ) }
    </main>
  );
}

Menu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Menu; 


// const Menu = ({ history }) => {
//   const [menu, setMenu] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;
//     getMenu().then(menuData => {
//       if (isMounted) {
//         setMenu(menuData);
//         setIsLoading(false);
//       }
//     });
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <Main headingText="Rock your taste buds with one of these!">
//       <LoaderMessage
//         loadingMsg="Loading menu."
//         doneMsg="Loading menu complete."
//         isLoading={isLoading}
//       />
//       {!isLoading && (
//         <div>
//           {menu.length > 0 && !isLoading ? (
//             <>
//               <IceCreamCardContainer>
//                 {menu.map(
//                   ({ id, iceCream, price, description, inStock, quantity }) => (
//                     <IceCreamCard
//                       key={id}
//                       iceCreamId={iceCream.id}
//                       to={`/menu-items/${id.toString()}`}
//                       heading={iceCream.name}
//                       history={history}
//                     >
//                       <div className={cardContentStyle}>
//                         <p className="price">{`$${price.toFixed(2)}`}</p>
//                         <p className={`stock${inStock ? '' : ' out'}`}>
//                           {inStock
//                             ? `${quantity} in stock`
//                             : 'Currently out of stock!'}
//                         </p>
//                         <p className="description">{description}</p>
//                       </div>
//                     </IceCreamCard>
//                   )
//                 )}
//               </IceCreamCardContainer>
//             </>
//           ) : (
//             <p>Your menu is empty! The sadness!!</p>
//           )}
//         </div>
//       )}
//     </Main>
//   );
// };

// Menu.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired,
//   }),
// };

// export default Menu;
