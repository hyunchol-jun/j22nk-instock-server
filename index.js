const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

const inventoriesRoutes = require("./routes/inventories");
app.use("/inventories", inventoriesRoutes);

app.listen(PORT, () => {
    console.log("Server listening on port" + PORT);
});