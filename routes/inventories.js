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
    const inventoryItem = readInventoryList()
    const singleInventoryItem = inventoryItem.find((item) => item.id === req.params.inventoryId);

    if (!singleInventoryItem)
        res.status(404).json({message: "Id is not found"});
    else
        res.json(singleInventoryItem);

    })
    
    .put((req, res) => {
    res.send("Put request to inventory ID: " + req.params.inventoryId);
    })
    .delete((req, res) => {
        const inventories = readInventoryList();
        const filteredInventories = inventories.filter((inventory) => {
            return inventory.id !== req.params.inventoryId;
        })
        fs.writeFileSync("./data/inventories.json", JSON.stringify(filteredInventories));
        res.status(200).json({message: `The specified inventory item (id: ${req.params.inventoryId}) was deleted successfully!`});
    })
    
    
module.exports = router;