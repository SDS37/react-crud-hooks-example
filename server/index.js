const { createApp } = require('./app');

const port = 5000;

createApp().listen(port, () =>
  console.log(`Project ICE server listening on port ${port}!`)
);
