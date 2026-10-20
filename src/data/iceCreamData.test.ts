import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { getIceCream, getIceCreams, getMenu } from "./iceCreamData";

const jsonResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

describe("ice cream data", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("sorts the menu by ice cream name", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse([
        { iceCream: { name: "Mint Stack" } },
        { iceCream: { name: "Cherry Blast" } },
      ]),
    );

    const menu = await getMenu();

    expect(fetchMock).toHaveBeenCalledWith("/api/menu", expect.anything());
    expect(menu.map((item) => item.iceCream.name)).toEqual([
      "Cherry Blast",
      "Mint Stack",
    ]);
  });

  test("sorts the special first, then by ice cream name", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse([
        { iceCream: { name: "Cherry Blast" }, isSpecial: false },
        { iceCream: { name: "Toxic Sludge" }, isSpecial: true },
        { iceCream: { name: "Arctic Rainbow" }, isSpecial: false },
      ]),
    );

    const menu = await getMenu();

    expect(menu.map((item) => item.iceCream.name)).toEqual([
      "Toxic Sludge",
      "Arctic Rainbow",
      "Cherry Blast",
    ]);
  });

  test("sorts catalogue flavours by name", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse([{ name: "Toxic Sludge" }, { name: "Arctic Rainbow" }]),
    );

    const flavours = await getIceCreams();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/menu/stock-ice-creams",
      expect.anything(),
    );
    expect(flavours.map((item) => item.name)).toEqual([
      "Arctic Rainbow",
      "Toxic Sludge",
    ]);
  });

  test("a non-OK response rejects with its status", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(getIceCreams()).rejects.toMatchObject({ status: 404 });
  });

  test("passes the abort signal to fetch", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));
    const { signal } = new AbortController();

    await getMenu({ signal });

    expect(fetchMock.mock.calls[0][1].signal).toBe(signal);
  });

  test("a missing ice cream id rejects with the not-found status", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(getIceCream(null)).rejects.toMatchObject({ status: 404 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/menu/stock-ice-creams/null",
      expect.anything(),
    );
  });
});
