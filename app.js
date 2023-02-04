const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const morgan = require("morgan");
const router = express.Router();

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("mongoose db connected");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
app.use(express.json());
app.use(morgan("dev"));

//routerss
require("./models/user");
require("./models/stories");
app.use(require("./routers/auth"));
require("./models/post");
app.use(require("./routers/post"));
app.use(require("./routers/stories"));

require("./models/user");
app.use(require("./routers/user"));

const middleware = (req, res, next) => {
  console.log("middleware is running");
  next();
};
app.use(middleware)

//edited


app.use(
  //testin
  router.get("/", (req, res) => {
    //res.json("for creating post:/createpost(loginreq)\n view all post: /post")
    res.json({
      post: "/post(loginreq)",
      createpost: "/createpost(login req)",
      mypost: "/mypost(loginreq)",
      signin: "/signin",
      signup: "/signup",
    });
  })
);

app.listen(PORT, () => {
  console.log("server is runnig at port", PORT);
});
