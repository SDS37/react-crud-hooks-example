import { useState, useEffect } from "react";

import { getMenu } from "../data/iceCreamData";

import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import Main from "../structure/Main";
import IceCreamCardContainer from "./IceCreamCardContainer";
import IceCreamCard from "./IceCreamCard";

import { css } from "@emotion/react";
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
      content: "";
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

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getMenu({ signal: controller.signal })
      .then((menuData) => {
        setMenu(menuData);
        setIsLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setHasError(true);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <Main headingText="Rock your taste buds with one of these!">
      <LoaderMessage
        loadingMessage="Ice creams loading"
        doneMessage="Menu complete"
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The menu could not be loaded." />}
      {menu.length > 0 ? (
        <IceCreamCardContainer>
          {menu.map(
            ({ id, iceCream, price, description, inStock, quantity }) => (
              <IceCreamCard
                key={id.toString()}
                iceCreamId={iceCream.id}
                to={`/menu-items/${id.toString()}`}
                heading={iceCream.name}
              >
                <div css={cardContentStyle}>
                  <p className="price">{`$${price.toFixed(2)}`}</p>
                  <p className={`stock${inStock ? "" : " out"}`}>
                    {inStock
                      ? `${quantity} in stock`
                      : "Currently out of stock!"}
                  </p>
                  <p className="description">{description}</p>
                </div>
              </IceCreamCard>
            ),
          )}
        </IceCreamCardContainer>
      ) : (
        !isLoading && !hasError && <p>nothing to show !</p>
      )}
    </Main>
  );
};

export default Menu;
