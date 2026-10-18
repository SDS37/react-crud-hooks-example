import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { getMenuItem, putMenuItem, deleteMenuItem } from "../data/iceCreamData";

import LoaderMessage from "../structure/LoaderMessage";
import Main from "../structure/Main";
import IceCream from "./IceCream";

const EditIceCream = () => {
  const navigate = useNavigate();
  const { menuItemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const [menuItem, setMenuItem] = useState({});

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getMenuItem(menuItemId)
      .then((item) => {
        if (isMounted.current) {
          setMenuItem(item);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.status === 404 && isMounted.current) {
          navigate("/", { replace: true, state: { focus: true } });
        }
      });
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
      {!isLoading && (
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
