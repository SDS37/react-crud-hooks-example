// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";

import * as data from "../data/iceCreamData";
import Menu from "./Menu";

vi.mock("../data/iceCreamData");

const item = (id: number, name: string, isSpecial: boolean) => ({
  id,
  iceCream: { id, name },
  inStock: true,
  quantity: 5,
  price: 2.5,
  description: "Cool",
  isSpecial,
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it("shows the badge on the special's card only", async () => {
  vi.mocked(data.getMenu).mockResolvedValue([
    item(2, "Mint Stack", true),
    item(1, "Cherry Blast", false),
  ]);

  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>,
  );

  expect(await screen.findAllByText("Today's special")).toHaveLength(1);
  const card = screen.getByText("Today's special").closest("section");
  expect(card?.textContent).toContain("Mint Stack");
});
