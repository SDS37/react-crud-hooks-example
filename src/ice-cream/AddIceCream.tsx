import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  getIceCream,
  postMenuItem,
  type CatalogueFlavour,
} from "../data/iceCreamData";

import Main from "../structure/Main";
import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import IceCream from "./IceCream";

const responseStatus = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  typeof error.status === "number"
    ? error.status
    : undefined;

const AddIceCream = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const iceCreamId = searchParams.get("iceCreamId");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iceCream, setIceCream] = useState<CatalogueFlavour | null>(null);
  const [hasSaveError, setHasSaveError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getIceCream(iceCreamId, { signal: controller.signal })
      .then((iceCreamResponse) => {
        setIceCream(iceCreamResponse);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (responseStatus(error) === 404) {
          navigate("/", { replace: true, state: { focus: true } });
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [navigate, iceCreamId]);

  const onSubmitHandler = (menuItem: Parameters<typeof postMenuItem>[0]) => {
    setHasSaveError(false);
    postMenuItem(menuItem)
      .then(() => {
        navigate("/", { state: { focus: true } });
      })
      .catch(() => setHasSaveError(true));
  };

  return (
    <Main headingText="Add some goodness to the menu">
      <LoaderMessage
        loadingMessage="Loading ice cream."
        doneMessage="Ice cream loaded."
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The ice cream could not be loaded." />}
      {!isLoading && !hasError && iceCream && (
        <IceCream iceCream={iceCream} onSubmit={onSubmitHandler} />
      )}
      {hasSaveError && (
        <LoadError message="The ice cream could not be saved." />
      )}
    </Main>
  );
};

export default AddIceCream;
