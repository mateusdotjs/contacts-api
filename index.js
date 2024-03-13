require("dotenv").config();
const express = require("express");
const app = express();
const port = 4000;
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandlers.js");
const connectDB = require("./config/dbConnection.js");

connectDB();

app.use(express.json());

app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
