import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Global, css } from "@emotion/react";
import Header from "./structure/Header";
import Footer from "./structure/Footer";

import geomanistBookWoff from "./assets/fonts/geomanist/geomanist-book.woff";
import geomanistBookWoff2 from "./assets/fonts/geomanist/geomanist-book.woff2";
import cornerstoneWoff from "./assets/fonts/cornerstone.woff";
import cornerstoneWoff2 from "./assets/fonts/cornerstone.woff2";

const globalStyle = css`
  @font-face {
    font-family: "geomanist";
    src:
      url(${geomanistBookWoff2}) format("woff2"),
      url(${geomanistBookWoff}) format("woff");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "cornerstone";
    src:
      url(${cornerstoneWoff2}) format("woff2"),
      url(${cornerstoneWoff}) format("woff");
    font-weight: 400;
    font-style: normal;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    color: #333;
    background: #ff71ba;
    font-family: "geomanist", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
  }

  #root {
    width: 100%;
  }

  a {
    &:hover {
      text-decoration: none;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: normal;
    padding: 0;
    margin: 0;
  }

  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 20px;
  }

  .visually-hidden:not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .skip-link {
    padding: 6px;
    position: absolute;
    top: -40px;
    left: 0px;
    color: white;
    border-right: 1px solid white;
    border-bottom: 1px solid white;
    border-bottom-right-radius: 8px;
    background: #5c4268;
    transition: top 1s ease-out;
    z-index: 100;

    &:focus {
      position: absolute;
      left: 0px;
      top: 0px;
      outline-color: transparent;
      transition: top 0.1s ease-in;
    }
  }
`;

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Global styles={globalStyle} />
        <div id="root">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

// Only the pre-rendered index.html shows this. Each page sets its own title.
export function HydrateFallback() {
  return <title>Ultimate Ice Cream</title>;
}
