import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { getIceCream, postMenuItem } from "../data/iceCreamData";

import Main from "../structure/Main";
import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import IceCream from "./IceCream";

const AddIceCream = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const iceCreamId = searchParams.get("iceCreamId");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iceCream, setIceCream] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    getIceCream(iceCreamId, { signal: controller.signal })
      .then((iceCreamResponse) => {
        setIceCream(iceCreamResponse);
        setIsLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          return;
        }
        if (err.status === 404) {
          navigate("/", { replace: true, state: { focus: true } });
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [navigate, iceCreamId]);

  const onSubmitHandler = (menuItem) => {
    postMenuItem(menuItem).then(() => {
      navigate("/", { state: { focus: true } });
    });
  };

  return (
    <Main headingText="Add some goodness to the menu">
      <LoaderMessage
        loadingMessage="Loading ice cream."
        doneMessage="Ice cream loaded."
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The ice cream could not be loaded." />}
      {!isLoading && !hasError && (
        <IceCream iceCream={iceCream} onSubmit={onSubmitHandler} />
      )}
    </Main>
  );
};

export default AddIceCream;
