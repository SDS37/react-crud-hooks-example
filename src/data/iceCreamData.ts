export type CatalogueFlavour = {
  id: number;
  name: string;
};

export type MenuItem = {
  id: number;
  iceCream: CatalogueFlavour;
  inStock: boolean;
  quantity: number;
  price: number;
  description: string;
};

type MenuItemInput = {
  iceCream: Pick<CatalogueFlavour, "id">;
  inStock: boolean;
  quantity: number;
  price: number;
  description: string;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

const request = async (
  url: string,
  { method = "GET", body, signal }: RequestOptions = {},
) => {
  const options: RequestInit = { method, signal };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    throw Object.assign(error, { status: response.status });
  }
  return response;
};

const requestJson = async <T>(
  url: string,
  options?: RequestOptions,
): Promise<T> => {
  const response = await request(url, options);
  return response.json();
};

export const getMenu = ({ signal }: { signal?: AbortSignal } = {}) =>
  requestJson<MenuItem[]>("/api/menu", { signal }).then((data) =>
    data.sort((a, b) => {
      if (a.iceCream.name < b.iceCream.name) {
        return -1;
      }
      if (a.iceCream.name > b.iceCream.name) {
        return 1;
      }
      return 0;
    }),
  );

export const getMenuItem = (
  id: string | number,
  { signal }: { signal?: AbortSignal } = {},
) => requestJson<MenuItem>(`/api/menu/${id}`, { signal });

export const putMenuItem = (
  menuItem: MenuItemInput & Pick<MenuItem, "id">,
  { signal }: { signal?: AbortSignal } = {},
) =>
  requestJson<MenuItem>(`/api/menu/${menuItem.id}`, {
    method: "PUT",
    body: menuItem,
    signal,
  });

export const deleteMenuItem = (
  id: string | number,
  { signal }: { signal?: AbortSignal } = {},
) => request(`/api/menu/${id}`, { method: "DELETE", signal });

export const getIceCreams = ({ signal }: { signal?: AbortSignal } = {}) =>
  requestJson<CatalogueFlavour[]>("/api/menu/stock-ice-creams", {
    signal,
  }).then((data) =>
    data.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }),
  );

export const getIceCream = (
  id: string | number | null,
  { signal }: { signal?: AbortSignal } = {},
) =>
  requestJson<CatalogueFlavour>(`/api/menu/stock-ice-creams/${id}`, { signal });

export const postMenuItem = (
  menuItem: MenuItemInput,
  { signal }: { signal?: AbortSignal } = {},
) =>
  requestJson<MenuItem>("/api/menu", {
    method: "POST",
    body: menuItem,
    signal,
  });
