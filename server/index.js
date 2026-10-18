const { createApp } = require("./app");

const port = 5001;

createApp().listen(port, () =>
  console.log(`Project ICE server listening on port ${port}!`),
);
