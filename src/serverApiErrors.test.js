import http from "node:http";
import { createApp } from "../server/app.js";

function request(app, method, path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        { hostname: "127.0.0.1", port, path, method },
        (res) => {
          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
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
      req.end();
    });
  });
}

describe("menu API errors", () => {
  test("a missing menu item is a not-found response", async () => {
    const response = await request(createApp(), "GET", "/api/menu/999");
    expect(response.status).toBe(404);
    expect(response.text).not.toMatch(/\bat\s.+\(.+:\d+:\d+\)/);
  });

  test("a write without a body fails without a stack trace", async () => {
    const response = await request(createApp(), "POST", "/api/menu");
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.text).not.toMatch(/\bat\s.+\(.+:\d+:\d+\)/);
    expect(response.text).not.toMatch(/TypeError/);
  });
});
