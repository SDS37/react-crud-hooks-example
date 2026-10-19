import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./ice-cream/Menu.tsx"),
  route("ice-creams", "./ice-cream/IceCreams.tsx"),
  route("menu-items/add", "./ice-cream/AddIceCream.tsx"),
  route("menu-items/:menuItemId", "./ice-cream/EditIceCream.tsx"),
  route("*", "./routes/catch-all.ts"),
] satisfies RouteConfig;
