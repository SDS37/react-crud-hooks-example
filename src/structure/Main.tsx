import { useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { css } from "@emotion/react";
const mainStyle = css`
  max-width: 63.75em;
  margin-left: auto;
  margin-right: auto;
  min-height: 40em;
  padding-top: 2em;
  padding-bottom: 2em;
  outline: 0;

  .main-heading {
    font-family: "cornerstone", sans-serif;
    padding: 1rem 0 2rem;
    color: #313030;
    font-size: 1.8em;
    outline: 0;
    text-align: center;
  }
`;

type MainProps = {
  headingText: string;
  headingLevel?: string | number;
  children: ReactNode;
};

const Main = ({ children, headingText, headingLevel = 2 }: MainProps) => {
  const heading = useRef<HTMLHeadingElement>(null);
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const navigate = useNavigate();
  const location = useLocation();
  const shouldFocus = Boolean(location.state && location.state.focus);

  // A save or delete that returns home asks for the heading to take focus.
  // Clear the request afterwards so a reload or Back does not repeat it.
  useEffect(() => {
    if (shouldFocus && heading.current) {
      heading.current.focus();
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        { replace: true, state: null, preventScrollReset: true },
      );
    }
  }, [
    shouldFocus,
    navigate,
    location.pathname,
    location.search,
    location.hash,
  ]);

  return (
    <main css={mainStyle} tabIndex={-1} id="main">
      <title>{`${headingText} | My Ice Cream`}</title>
      <Heading className="main-heading" ref={heading} tabIndex={-1}>
        {headingText}
      </Heading>
      {children}
    </main>
  );
};

export default Main;
