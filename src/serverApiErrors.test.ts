import http from "node:http";
import type { AddressInfo } from "node:net";
import type { Express } from "express";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type MockInstance,
} from "vitest";

import { createApp } from "../server/app.ts";

function request(
  app: Express,
  method: string,
  path: string,
  body?: string,
): Promise<{ status: number | undefined; text: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: body ? { "Content-Type": "application/json" } : {},
        },
        (res) => {
          const chunks: Uint8Array[] = [];
          res.on("data", (chunk: Uint8Array) => chunks.push(chunk));
          res.on("end", () => {
            server.close();
            resolve({
              status: res.statusCode,
              text: Buffer.concat(chunks).toString(),
            });
          });
        },
      );
      req.on("error", (error) => {
        server.close();
        reject(error);
      });
      req.end(body);
    });
  });
}

describe("menu API errors", () => {
  test("a missing menu item is a not-found response", async () => {
    const response = await request(createApp(), "GET", "/api/menu/999");
    expect(response.status).toBe(404);
    expect(response.text).not.toMatch(/\bat\s.+\(.+:\d+:\d+\)/);
  });

  test("a non-numeric catalogue id is a not-found response", async () => {
    const response = await request(
      createApp(),
      "GET",
      "/api/menu/stock-ice-creams/null",
    );
    expect(response.status).toBe(404);
  });

  test("a write without a body fails without a stack trace", async () => {
    const response = await request(createApp(), "POST", "/api/menu");
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.text).not.toMatch(/\bat\s.+\(.+:\d+:\d+\)/);
    expect(response.text).not.toMatch(/TypeError/);
  });

  describe("server log", () => {
    let error: MockInstance;
    beforeEach(() => {
      error = vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      error.mockRestore();
    });

    test("logs the stack of a 500 and still sends none to the client", async () => {
      const response = await request(createApp(), "POST", "/api/menu");
      expect(response.status).toBe(500);
      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[0][0]).toMatch(/\bat\s.+:\d+:\d+/);
      expect(response.text).not.toMatch(/\bat\s.+:\d+:\d+/);
    });

    test("does not log a request body", async () => {
      const response = await request(
        createApp(),
        "POST",
        "/api/menu",
        '{"secret": nope',
      );
      expect(response.status).toBe(400);
      expect(JSON.stringify(error.mock.calls)).not.toContain("secret");
    });

    test("does not log a not-found response", async () => {
      await request(createApp(), "GET", "/api/menu/999");
      expect(error).not.toHaveBeenCalled();
    });
  });
});
