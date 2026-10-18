import axios from "axios";
import { getIceCreams, getMenu } from "./iceCreamData";

vi.mock("axios");

describe("ice cream data", () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  test("sorts the menu by ice cream name", async () => {
    axios.get.mockResolvedValue({
      data: [
        { iceCream: { name: "Mint Stack" } },
        { iceCream: { name: "Cherry Blast" } },
      ],
    });

    const menu = await getMenu();

    expect(axios.get).toHaveBeenCalledWith("/api/menu");
    expect(menu.map((item) => item.iceCream.name)).toEqual([
      "Cherry Blast",
      "Mint Stack",
    ]);
  });

  test("sorts catalogue flavours by name", async () => {
    axios.get.mockResolvedValue({
      data: [{ name: "Toxic Sludge" }, { name: "Arctic Rainbow" }],
    });

    const flavours = await getIceCreams();

    expect(axios.get).toHaveBeenCalledWith("/api/menu/stock-ice-creams");
    expect(flavours.map((item) => item.name)).toEqual([
      "Arctic Rainbow",
      "Toxic Sludge",
    ]);
  });
});
