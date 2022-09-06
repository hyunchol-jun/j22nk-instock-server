const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});