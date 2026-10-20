import http from "node:http";
import type { AddressInfo } from "node:net";
import type { Express } from "express";
import { describe, expect, test } from "vitest";

import { createApp } from "../server/app.ts";

function request<Body = unknown>(
  app: Express,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number | undefined; body: Body }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      const payload = body === undefined ? null : JSON.stringify(body);
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
              }
            : {},
        },
        (res) => {
          const chunks: Uint8Array[] = [];
          res.on("data", (chunk: Uint8Array) => chunks.push(chunk));
          res.on("end", () => {
            server.close();
            const text = Buffer.concat(chunks).toString();
            let parsed: unknown = text;
            try {
              parsed = text ? JSON.parse(text) : text;
            } catch (error) {
              parsed = text;
            }
            resolve({ status: res.statusCode, body: parsed as Body });
          });
        },
      );
      req.on("error", (error) => {
        server.close();
        reject(error);
      });
      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

describe("menu API", () => {
  test("stock route is not captured by the menu id route", async () => {
    const response = await request<{ name: string }[]>(
      createApp(),
      "GET",
      "/api/menu/stock-ice-creams",
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((item) => item.name === "Stripey Madness")).toBe(
      true,
    );
    expect(response.body.some((item) => item.name === "Cherry Blast")).toBe(
      false,
    );
  });

  test("post stores the catalogue name for the ice cream id", async () => {
    const response = await request<{
      iceCream: { id: number; name: string };
    }>(createApp(), "POST", "/api/menu", {
      iceCream: { id: 0, name: "Wrong name" },
      inStock: true,
      quantity: 4,
      price: 1.25,
      description: "A test scoop",
    });
    expect(response.status).toBe(200);
    expect(response.body.iceCream).toEqual({
      id: 0,
      name: "Stripey Madness",
    });
  });

  test("put stores the catalogue name for the ice cream id", async () => {
    const response = await request<{ iceCream: { name: string } }>(
      createApp(),
      "PUT",
      "/api/menu/1",
      {
        iceCream: { id: 0, name: "Wrong name" },
        inStock: true,
        quantity: 4,
        price: 1.25,
        description: "A test scoop",
      },
    );
    expect(response.body.iceCream.name).toBe("Stripey Madness");
  });

  test("a new app starts from the seed menu", async () => {
    const first = await request(createApp(), "DELETE", "/api/menu/1");
    expect(first.status).toBe(204);
    const second = await request<{ iceCream: { name: string } }>(
      createApp(),
      "GET",
      "/api/menu/1",
    );
    expect(second.status).toBe(200);
    expect(second.body.iceCream.name).toBe("Cherry Blast");
  });

  describe("special", () => {
    type Item = { id: number; isSpecial: boolean };
    const input = (id: number, extra: object = {}) => ({
      iceCream: { id },
      inStock: true,
      quantity: 4,
      price: 1.25,
      description: "A test scoop",
      ...extra,
    });
    const specials = async (app: Express) => {
      const menu = await request<Item[]>(app, "GET", "/api/menu");
      return menu.body.filter((item) => item.isSpecial).map((item) => item.id);
    };

    test("a fresh menu has no special", async () => {
      const app = createApp();
      expect(await specials(app)).toEqual([]);
      const menu = await request<Item[]>(app, "GET", "/api/menu");
      expect(menu.body.every((item) => item.isSpecial === false)).toBe(true);
    });

    test("post with isSpecial makes it the only special, and a second post moves it", async () => {
      const app = createApp();
      const first = await request<Item>(
        app,
        "POST",
        "/api/menu",
        input(0, { isSpecial: true }),
      );
      expect(first.body.isSpecial).toBe(true);
      expect(await specials(app)).toEqual([first.body.id]);
      const second = await request<Item>(
        app,
        "POST",
        "/api/menu",
        input(2, { isSpecial: true }),
      );
      expect(await specials(app)).toEqual([second.body.id]);
      const moved = await request<Item>(
        app,
        "GET",
        `/api/menu/${first.body.id}`,
      );
      expect(moved.body.isSpecial).toBe(false);
    });

    test("put with isSpecial moves the special, and false leaves none", async () => {
      const app = createApp();
      await request(app, "PUT", "/api/menu/1", input(1, { isSpecial: true }));
      expect(await specials(app)).toEqual([1]);
      await request(app, "PUT", "/api/menu/2", input(15, { isSpecial: true }));
      expect(await specials(app)).toEqual([2]);
      await request(app, "PUT", "/api/menu/2", input(15, { isSpecial: false }));
      expect(await specials(app)).toEqual([]);
    });

    test("put without isSpecial keeps it, and post without it stores false", async () => {
      const app = createApp();
      await request(app, "PUT", "/api/menu/1", input(1, { isSpecial: true }));
      const put = await request<Item>(
        app,
        "PUT",
        "/api/menu/1",
        input(1, { price: 2 }),
      );
      expect(put.body.isSpecial).toBe(true);
      expect(await specials(app)).toEqual([1]);
      const post = await request<Item>(app, "POST", "/api/menu", input(0));
      expect(post.body.isSpecial).toBe(false);
    });

    test("deleting the special leaves no special", async () => {
      const app = createApp();
      await request(app, "PUT", "/api/menu/1", input(1, { isSpecial: true }));
      await request(app, "DELETE", "/api/menu/1");
      expect(await specials(app)).toEqual([]);
    });
  });
});
