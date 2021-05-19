import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { css } from 'emotion/macro';
const loaderMessageStyle = css`
  .loading {
    font-size: 3em;
    font-weight: bold;
    width: 100%;
    text-align: center;
    margin: 0;
    padding-bottom: 3em;
  }
`;

const LoaderMessage = ({loadingMessage, doneMessage, isLoading}) => {
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);
  const [showDoneMessage, setShowDoneMessage] = useState(false);
  const isLoadingPreviousValue = useRef(null);

  useEffect(() => {
    let loadingMessageDelay;
    let doneMessageDelay;

    if(isLoading) {
      loadingMessageDelay = setTimeout( () => {
        setShowLoadingMessage(true);
      }, 400);
    } else {
      if (isLoadingPreviousValue.current) {
        setShowDoneMessage(true);
        doneMessageDelay = setTimeout(() => {
          setShowDoneMessage(false);
        }, 300);
      }
    }

    isLoadingPreviousValue.current = isLoading;
    return () => {
      clearTimeout(loadingMessageDelay);
      clearTimeout(doneMessageDelay);
      setShowLoadingMessage(false);
      setShowDoneMessage(false);
    }
  }, [isLoading])

  return (
    <div aria-live="assertive" aria-atomic="true" className={loaderMessageStyle}>
      {showLoadingMessage && <p>{loadingMessage}</p>}
      {showDoneMessage && <p className="visually-hidden">{doneMessage}</p>}
    </div>
  );
}

LoaderMessage.propTypes = {
  loadingMessage: PropTypes.string.isRequired,
  doneMessage: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default LoaderMessage;
