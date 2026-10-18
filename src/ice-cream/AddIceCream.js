import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { getIceCream, postMenuItem } from "../data/iceCreamData";

import Main from "../structure/Main";
import LoaderMessage from "../structure/LoaderMessage";
import IceCream from "./IceCream";

const AddIceCream = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const iceCreamId = searchParams.get("iceCreamId");
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [iceCream, setIceCream] = useState({});

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getIceCream(iceCreamId)
      .then((iceCreamResponse) => {
        if (isMounted.current) {
          setIceCream(iceCreamResponse);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.status === 404 && isMounted) {
          navigate("/", { replace: true, state: { focus: true } });
        }
      });
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
      {!isLoading && (
        <IceCream iceCream={iceCream} onSubmit={onSubmitHandler} />
      )}
    </Main>
  );
};

export default AddIceCream;
