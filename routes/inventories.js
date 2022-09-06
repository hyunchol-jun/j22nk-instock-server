const express = require("express");
const router = express.Router();

router.route("/")
    .get((req, res) => {
        res.send("Get request to inventories");
    })
    .post((req, res) => {
        res.send("Post request to inventories");
    })

router.route("/:inventoryId")
    .get((req, res) => {
    res.send("Get request to inventory ID: " + req.params.inventoryId);
})
    .put((req, res) => {
    res.send("Put request to inventory ID: " + req.params.inventoryId);
})

module.exports = router;