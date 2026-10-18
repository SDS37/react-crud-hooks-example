import { index, route } from "@react-router/dev/routes";

export default [
  index("./ice-cream/Menu.js"),
  route("ice-creams", "./ice-cream/IceCreams.js"),
  route("menu-items/add", "./ice-cream/AddIceCream.js"),
  route("menu-items/:menuItemId", "./ice-cream/EditIceCream.js"),
  route("*", "./routes/catch-all.js"),
];
