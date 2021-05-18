import React, { useState } from 'react';

import Helmet from 'react-helmet';

// import Main from '../structure/Main';
// import LoaderMessage from '../structure/LoaderMessage';
// import IceCream from './IceCream';
// import { getMenuItem, putMenuItem, deleteMenuItem } from '../data/iceCreamData';
// import PropTypes from 'prop-types';

const EditIceCream = ({ match, history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuItem, setMenuItem] = useState({});

  // useEffect(() => {
  //   let isMounted = true;
  //   getMenuItem(match.params.menuItemId)
  //     .then(item => {
  //       if (isMounted) {
  //         setMenuItem(item);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch(err => {
  //       if (err.response.status === 404 && isMounted) {
  //         history.replace('/', { focus: true });
  //       }
  //     });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [match.params.menuItemId, history]);

  // const onSubmitHandler = updatedItem => {
  //   putMenuItem({ id: menuItem.id, ...updatedItem }).then(() => {
  //     history.push('/', { focus: true });
  //   });
  // };

  // const onDeleteHandler = () => {
  //   deleteMenuItem(match.params.menuItemId).then(() => {
  //     history.replace('/', { focus: true });
  //   });
  // };

  return (
    <main>
      <Helmet>
        <title>Update this beauty | My Ice Cream</title>
      </Helmet>
      <h3>Update this beauty</h3>
    </main>
    // <Main headingText="Update this beauty">
    //   <LoaderMessage
    //     loadingMsg="Loading ice cream."
    //     doneMsg="Ice cream loaded."
    //     isLoading={isLoading}
    //   />
    //   {!isLoading && (
    //     <IceCream
    //       {...menuItem}
    //       onDelete={onDeleteHandler}
    //       onSubmit={onSubmitHandler}
    //     />
    //   )}
    // </Main>
  );
};

// EditIceCream.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.object.isRequired,
//   }),
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired,
//     replace: PropTypes.func.isRequired,
//   }),
// };

export default EditIceCream;
