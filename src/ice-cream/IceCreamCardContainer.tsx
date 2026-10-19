import { Children, type ReactNode } from "react";

import { css } from "@emotion/react";
const containerStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 1fr;
  grid-gap: 2em;
  list-style: none;
  padding: 0;
  margin: 0;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

type IceCreamCardContainerProps = {
  children: ReactNode;
};

const IceCreamCardContainer = ({ children }: IceCreamCardContainerProps) => (
  <ul css={containerStyle}>
    {Children.map(children, (card) => (
      <li>{card}</li>
    ))}
  </ul>
);

export default IceCreamCardContainer;
