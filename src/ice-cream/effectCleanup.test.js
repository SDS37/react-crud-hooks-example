// @vitest-environment jsdom
import { StrictMode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as data from "../data/iceCreamData";
import AddIceCream from "./AddIceCream";
import EditIceCream from "./EditIceCream";
import IceCreams from "./IceCreams";
import Menu from "./Menu";

vi.mock("../data/iceCreamData");

const abortError = () => new DOMException("aborted", "AbortError");

// Resolves or rejects only when the test says so; rejects on abort like fetch.
const pending = () => {
  const calls = [];
  const impl = (...args) => {
    const options = args[args.length - 1] || {};
    return new Promise((resolve, reject) => {
      calls.push({ resolve, reject, signal: options.signal });
      options.signal?.addEventListener("abort", () => reject(abortError()));
    });
  };
  return { calls, impl };
};

const emptyText = {
  Menu: "nothing to show !",
  IceCreams: "Your menu is fully stocked!",
};

const Home = () => <p>home page</p>;

const renderAt = (path, routePath, Component, strict = false) => {
  const tree = (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={routePath} element={<Component />} />
      </Routes>
    </MemoryRouter>
  );
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
};

const cases = [
  ["Menu", "getMenu", "/menu", "/menu", Menu],
  ["IceCreams", "getIceCreams", "/ice-creams", "/ice-creams", IceCreams],
  [
    "EditIceCream",
    "getMenuItem",
    "/menu-items/3",
    "/menu-items/:id",
    EditIceCream,
  ],
  ["AddIceCream", "getIceCream", "/add?iceCreamId=2", "/add", AddIceCream],
];

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe.each(cases)("%s", (name, fn, path, routePath, Component) => {
  it("aborts its request on unmount without a warning", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { calls, impl } = pending();
    data[fn].mockImplementation(impl);
    const { unmount } = renderAt(path, routePath, Component);
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0].signal.aborted).toBe(false);
    unmount();
    expect(calls[0].signal.aborted).toBe(true);
    await new Promise((r) => setTimeout(r, 0));
    expect(error).not.toHaveBeenCalled();
  });

  it("does not redirect or report when the abort rejects", async () => {
    const { calls, impl } = pending();
    data[fn].mockImplementation(impl);
    const { unmount } = renderAt(path, routePath, Component);
    await waitFor(() => expect(calls).toHaveLength(1));
    unmount();
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByText("home page")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("surfaces a real failure", async () => {
    data[fn].mockRejectedValue(
      Object.assign(new Error("Request failed with status 500"), {
        status: 500,
      }),
    );
    renderAt(path, routePath, Component);
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText("home page")).toBeNull();
    if (emptyText[name]) {
      expect(screen.queryByText(emptyText[name])).toBeNull();
    }
  });

  it("loads under StrictMode", async () => {
    const { calls, impl } = pending();
    data[fn].mockImplementation(impl);
    renderAt(path, routePath, Component, true);
    await waitFor(() => expect(calls.length).toBeGreaterThan(1));
    const live = calls.find((c) => !c.signal.aborted);
    expect(live).toBeTruthy();
    expect(calls[0].signal.aborted).toBe(true);
  });
});

describe.each(cases.slice(2))(
  "%s not found",
  (name, fn, path, routePath, Component) => {
    it("redirects home on a 404", async () => {
      data[fn].mockRejectedValue(
        Object.assign(new Error("nf"), { status: 404 }),
      );
      renderAt(path, routePath, Component);
      expect(await screen.findByText("home page")).toBeTruthy();
    });
  },
);
