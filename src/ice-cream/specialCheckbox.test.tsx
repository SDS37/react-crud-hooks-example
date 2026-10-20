// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as data from "../data/iceCreamData";
import AddIceCream from "./AddIceCream";
import EditIceCream from "./EditIceCream";

vi.mock("../data/iceCreamData");

const hint =
  "Out of stock items can't be today's special. Untick this or restock to save.";
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

const renderEdit = (item: typeof menuItem) => {
  vi.mocked(data.getMenuItem).mockResolvedValue(item);
  vi.mocked(data.putMenuItem).mockResolvedValue(item);
  render(
    <MemoryRouter initialEntries={["/menu-items/7"]}>
      <Routes>
        <Route path="/" element={<p>home page</p>} />
        <Route path="/menu-items/:menuItemId" element={<EditIceCream />} />
      </Routes>
    </MemoryRouter>,
  );
  return screen.findByDisplayValue("Cool");
};

const specialBox = () =>
  screen.getByLabelText(/Today's special/) as HTMLInputElement;

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("the Today's special checkbox", () => {
  it("starts unchecked and enabled on add, and is sent on save", async () => {
    vi.mocked(data.getIceCream).mockResolvedValue(iceCream);
    vi.mocked(data.postMenuItem).mockResolvedValue(menuItem);
    render(
      <MemoryRouter initialEntries={["/add?iceCreamId=2"]}>
        <Routes>
          <Route path="/" element={<p>home page</p>} />
          <Route path="/add" element={<AddIceCream />} />
        </Routes>
      </MemoryRouter>,
    );
    await screen.findByLabelText(/Today's special/);
    expect(specialBox().checked).toBe(false);
    expect(specialBox().disabled).toBe(false);
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { name: "description", value: "Cool" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/), {
      target: { name: "quantity", value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Price/), {
      target: { name: "price", value: "2.50" },
    });
    fireEvent.click(specialBox());
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("home page");
    expect(data.postMenuItem).toHaveBeenCalledWith(
      expect.objectContaining({ isSpecial: true }),
    );
  });

  it("starts from the menu item on edit", async () => {
    await renderEdit({ ...menuItem, isSpecial: true });
    expect(specialBox().checked).toBe(true);
    expect(specialBox().disabled).toBe(false);
    expect(screen.queryByText(hint)).toBeNull();
  });

  it("is disabled when unchecked and out of stock, without a hint", async () => {
    await renderEdit({ ...menuItem, inStock: false, quantity: 0 });
    expect(specialBox().checked).toBe(false);
    expect(specialBox().disabled).toBe(true);
    expect(screen.queryByText(hint)).toBeNull();
  });

  it("stays enabled and shows the linked hint when checked and out of stock", async () => {
    await renderEdit({
      ...menuItem,
      inStock: false,
      quantity: 0,
      isSpecial: true,
    });
    expect(specialBox().checked).toBe(true);
    expect(specialBox().disabled).toBe(false);
    const hintEl = screen.getByText(hint);
    expect(specialBox().getAttribute("aria-describedby")).toBe(hintEl.id);
    expect(
      (screen.getByRole("button", { name: "Save" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });

  it("does not untick itself when the item goes out of stock, and the hint follows", async () => {
    await renderEdit({ ...menuItem, isSpecial: true });
    fireEvent.click(screen.getByLabelText(/In Stock/));
    expect(specialBox().checked).toBe(true);
    expect(screen.getByText(hint)).toBeTruthy();
    fireEvent.click(specialBox());
    expect(specialBox().checked).toBe(false);
    expect(specialBox().disabled).toBe(true);
    expect(screen.queryByText(hint)).toBeNull();
  });

  it("sends isSpecial true on a checked save even when out of stock", async () => {
    await renderEdit({
      ...menuItem,
      inStock: false,
      quantity: 0,
      isSpecial: true,
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("home page");
    expect(data.putMenuItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7, isSpecial: true, inStock: false }),
    );
  });
});
