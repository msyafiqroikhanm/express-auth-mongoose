require("dotenv").config();
const router = require("express").Router();
const v1Routes = require("./V1/index.routes");

router.get("/", (req, res) =>
  res.send({ app: `${process.env.APP_NAME} App ` })
);
router.use("/v1", v1Routes);

module.exports = router;
