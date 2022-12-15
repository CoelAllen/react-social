const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log("connected to mongo");
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(8080, () => {
  console.log("Its Alive");
});
