const request = async (url, { method = "GET", body, signal } = {}) => {
  const options = { method, signal };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response;
};

const requestJson = async (url, options) => {
  const response = await request(url, options);
  return response.json();
};

export const getMenu = ({ signal } = {}) =>
  requestJson("/api/menu", { signal }).then((data) =>
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

export const getMenuItem = (id, { signal } = {}) =>
  requestJson(`/api/menu/${id}`, { signal });

export const putMenuItem = (menuItem, { signal } = {}) =>
  requestJson(`/api/menu/${menuItem.id.toString()}`, {
    method: "PUT",
    body: menuItem,
    signal,
  });

export const deleteMenuItem = (id, { signal } = {}) =>
  request(`/api/menu/${id.toString()}`, { method: "DELETE", signal });

export const getIceCreams = ({ signal } = {}) =>
  requestJson("/api/menu/stock-ice-creams", { signal }).then((data) =>
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

export const getIceCream = (id, { signal } = {}) =>
  requestJson(`/api/menu/stock-ice-creams/${id.toString()}`, { signal });

export const postMenuItem = (menuItem, { signal } = {}) =>
  requestJson("/api/menu", { method: "POST", body: menuItem, signal });
