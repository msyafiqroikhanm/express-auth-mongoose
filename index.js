const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000;
require("dotenv").config();

const server = http.createServer(app);

server.listen(port, async () => {
  // await db.sequelize.authenticate();
  console.log(
    `${process.env.APP_NAME} running on  url: ${
      process.env.BASE_URL
    }, environment: ${process.env.NODE_ENV.toUpperCase()}`
  );

  if (process.env.NODE_ENV === "production") {
    await metaBroadcastSynchronize();
  }
});
