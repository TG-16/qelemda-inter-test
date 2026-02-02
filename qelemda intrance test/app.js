require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const providerRoute = require("./routes/providerRoute");
const userRoute = require("./routes/userRoute");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/provider", providerRoute);
app.use("/api/user", userRoute);


app.listen(process.env.PORT, () => {
console.log(`Server started on port ${process.env.PORT}`);
});