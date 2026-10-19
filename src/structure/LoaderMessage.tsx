import { useEffect, useState, useRef } from "react";

import { css } from "@emotion/react";
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

type LoaderMessageProps = {
  loadingMessage: string;
  doneMessage: string;
  isLoading?: boolean;
};

const LoaderMessage = ({
  loadingMessage,
  doneMessage,
  isLoading,
}: LoaderMessageProps) => {
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);
  const [showDoneMessage, setShowDoneMessage] = useState(false);
  const isLoadingPreviousValue = useRef<boolean | null>(null);

  useEffect(() => {
    let loadingMessageDelay: ReturnType<typeof setTimeout> | undefined;
    let doneMessageDelay: ReturnType<typeof setTimeout> | undefined;

    if (isLoading) {
      loadingMessageDelay = setTimeout(() => {
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

    isLoadingPreviousValue.current = isLoading ?? null;
    return () => {
      clearTimeout(loadingMessageDelay);
      clearTimeout(doneMessageDelay);
      setShowLoadingMessage(false);
      setShowDoneMessage(false);
    };
  }, [isLoading]);

  return (
    <div aria-live="assertive" aria-atomic="true" css={loaderMessageStyle}>
      {showLoadingMessage && <p>{loadingMessage}</p>}
      {showDoneMessage && <p className="visually-hidden">{doneMessage}</p>}
    </div>
  );
};

export default LoaderMessage;
