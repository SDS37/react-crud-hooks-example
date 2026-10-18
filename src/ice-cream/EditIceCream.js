import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { getMenuItem, putMenuItem, deleteMenuItem } from "../data/iceCreamData";

import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import Main from "../structure/Main";
import IceCream from "./IceCream";

const EditIceCream = () => {
  const navigate = useNavigate();
  const { menuItemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [menuItem, setMenuItem] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);
    getMenuItem(menuItemId, { signal: controller.signal })
      .then((item) => {
        setMenuItem(item);
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
  }, [menuItemId, navigate]);

  const onSubmitHandler = (updatedItem) => {
    putMenuItem({ id: menuItem.id, ...updatedItem }).then(() => {
      navigate("/", { state: { focus: true } });
    });
  };

  const onDeleteHandler = () => {
    deleteMenuItem(menuItemId).then(() => {
      navigate("/", { replace: true, state: { focus: true } });
    });
  };

  return (
    <Main headingText="Update this beauty">
      <LoaderMessage
        loadingMessage="Loading ice cream."
        doneMessage="Ice cream loaded."
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The ice cream could not be loaded." />}
      {!isLoading && !hasError && (
        <IceCream
          {...menuItem}
          onDelete={onDeleteHandler}
          onSubmit={onSubmitHandler}
        />
      )}
    </Main>
  );
};

export default EditIceCream;
