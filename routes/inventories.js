const express = require("express");
const router = express.Router();
const fs = require("fs");

function readInventoryList() {
    const inventoriesListFile = fs.readFileSync("./data/inventories.json");
    const inventoryListData = JSON.parse(inventoriesListFile);
    return inventoryListData
}

router.route("/")
    .get((req, res) => {
        const inventoryList = readInventoryList();
        res.send(inventoryList);
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