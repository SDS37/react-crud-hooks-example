import { useEffect, useState } from "react";

import { getIceCreams } from "../data/iceCreamData";

import Main from "../structure/Main";
import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import IceCreamCard from "./IceCreamCard";
import IceCreamCardContainer from "./IceCreamCardContainer";

import { css } from "@emotion/react";
const paragraphStyle = css`
  max-width: 60%;
  margin: 0 auto;
  padding-bottom: 3em;
`;

const IceCreams = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iceCreams, setIceCreams] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getIceCreams({ signal: controller.signal })
      .then((iceCreams) => {
        setIceCreams(iceCreams);
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
    <Main headingText="Choose your poison and enjoy!">
      <LoaderMessage
        loadingMessage="Loading the stock list."
        doneMessage="Loading stock list complete."
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The stock list could not be loaded." />}
      {iceCreams.length > 0 ? (
        <IceCreamCardContainer>
          {iceCreams.map(({ id, name }) => (
            <IceCreamCard
              key={id.toString()}
              iceCreamId={id}
              heading={name}
              to={{
                pathname: "/menu-items/add",
                search: `?iceCreamId=${id.toString()}`,
              }}
            />
          ))}
        </IceCreamCardContainer>
      ) : (
        !isLoading &&
        !hasError && <p css={paragraphStyle}>Your menu is fully stocked!</p>
      )}
    </Main>
  );
};

export default IceCreams;
