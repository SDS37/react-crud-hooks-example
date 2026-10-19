import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { Route } from "./+types/EditIceCream";

import {
  getMenuItem,
  putMenuItem,
  deleteMenuItem,
  postMenuItem,
  type MenuItem,
} from "../data/iceCreamData";

import LoadError from "../structure/LoadError";
import LoaderMessage from "../structure/LoaderMessage";
import Main from "../structure/Main";
import IceCream from "./IceCream";

const responseStatus = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  typeof error.status === "number"
    ? error.status
    : undefined;

const EditIceCream = () => {
  const navigate = useNavigate();
  const { menuItemId } = useParams<Route.ComponentProps["params"]>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);
    if (typeof menuItemId !== "string") {
      return;
    }
    getMenuItem(menuItemId, { signal: controller.signal })
      .then((item) => {
        setMenuItem(item);
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
  }, [menuItemId, navigate]);

  const onSubmitHandler = (updatedItem: Parameters<typeof postMenuItem>[0]) => {
    if (!menuItem) {
      return;
    }
    setSaveError("");
    putMenuItem({ id: menuItem.id, ...updatedItem })
      .then(() => {
        navigate("/", { state: { focus: true } });
      })
      .catch(() => setSaveError("The ice cream could not be saved."));
  };

  const onDeleteHandler = () => {
    setSaveError("");
    if (typeof menuItemId !== "string") {
      return;
    }
    deleteMenuItem(menuItemId)
      .then(() => {
        navigate("/", { replace: true, state: { focus: true } });
      })
      .catch(() => setSaveError("The ice cream could not be deleted."));
  };

  return (
    <Main headingText="Update this beauty">
      <LoaderMessage
        loadingMessage="Loading ice cream."
        doneMessage="Ice cream loaded."
        isLoading={isLoading}
      />
      {hasError && <LoadError message="The ice cream could not be loaded." />}
      {!isLoading && !hasError && menuItem && (
        <IceCream
          iceCream={menuItem.iceCream}
          price={menuItem.price}
          quantity={menuItem.quantity}
          inStock={menuItem.inStock}
          description={menuItem.description}
          onDelete={onDeleteHandler}
          onSubmit={onSubmitHandler}
        />
      )}
      {saveError && <LoadError message={saveError} />}
    </Main>
  );
};

export default EditIceCream;
