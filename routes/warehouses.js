const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Get request to warehouses");
})

router.route("/:warehouseId")
    .get((req, res) => {
    res.send("Get request to warehouse ID: " + req.params.warehouseId);
})
    .put((req, res) => {
    res.send("Put request to warehouse ID: " + req.params.warehouseId);
})
    .post((req, res) => {
    res.send("Post request to warehouse ID: " + req.params.warehouseId);
})

module.exports = router;