const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {PORT} = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server listening on port" + PORT);
});