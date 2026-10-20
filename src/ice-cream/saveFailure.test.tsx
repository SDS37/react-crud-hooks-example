// @vitest-environment jsdom
import type { ComponentType } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as data from "../data/iceCreamData";
import AddIceCream from "./AddIceCream";
import EditIceCream from "./EditIceCream";

vi.mock("../data/iceCreamData");

const iceCream = { id: 2, name: "Mint Stack" };
const menuItem = {
  id: 7,
  iceCream,
  inStock: true,
  quantity: 5,
  price: 2.5,
  description: "Cool",
  isSpecial: false,
};

const serverError = () =>
  Object.assign(new Error("Request failed with status 500"), { status: 500 });

const renderAt = (path: string, routePath: string, Component: ComponentType) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>home page</p>} />
        <Route path={routePath} element={<Component />} />
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("a failed save or delete", () => {
  it("keeps the add form and shows an alert", async () => {
    vi.mocked(data.getIceCream).mockResolvedValue(iceCream);
    vi.mocked(data.postMenuItem).mockRejectedValue(serverError());
    renderAt("/add?iceCreamId=2", "/add", AddIceCream);
    fireEvent.change(await screen.findByLabelText(/Description/), {
      target: { name: "description", value: "Cool" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/), {
      target: { name: "quantity", value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Price/), {
      target: { name: "price", value: "2.50" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText("home page")).toBeNull();
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("keeps the edit form and shows an alert on save", async () => {
    vi.mocked(data.getMenuItem).mockResolvedValue(menuItem);
    vi.mocked(data.putMenuItem).mockRejectedValue(serverError());
    renderAt("/menu-items/7", "/menu-items/:menuItemId", EditIceCream);
    await screen.findByDisplayValue("Cool");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText("home page")).toBeNull();
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("keeps the edit form and shows an alert on delete", async () => {
    vi.mocked(data.getMenuItem).mockResolvedValue(menuItem);
    vi.mocked(data.deleteMenuItem).mockRejectedValue(serverError());
    renderAt("/menu-items/7", "/menu-items/:menuItemId", EditIceCream);
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText("home page")).toBeNull();
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
  });

  it("clears the alert and goes home when a retry succeeds", async () => {
    vi.mocked(data.getMenuItem).mockResolvedValue(menuItem);
    vi.mocked(data.putMenuItem)
      .mockRejectedValueOnce(serverError())
      .mockResolvedValue(menuItem);
    renderAt("/menu-items/7", "/menu-items/:menuItemId", EditIceCream);
    await screen.findByDisplayValue("Cool");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("home page")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
