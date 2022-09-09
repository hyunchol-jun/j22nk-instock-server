const express = require("express");
const router = express.Router();
const fs = require("fs");
const crypto = require("crypto");

const inventoriesFilePath = "./data/inventories.json";

function readInventoryList() {
    const inventoriesListFile = fs.readFileSync("./data/inventories.json");
    const inventoryListData = JSON.parse(inventoriesListFile);
    return inventoryListData
}

function WriteInventories(inventories) {
    fs.writeFileSync(inventoriesFilePath, JSON.stringify(inventories));
}

router.route("/")
    .get((req, res) => {
        const inventoryList = readInventoryList();
        res.send(inventoryList);
    })
    .post((req, res) => {
        if (!req.body.itemName) {
            return res.status(400).send("This field is required");
        } 
          
        if (!req.body.description) {
            return res.status(400).send("This field is required");
        }
        
        if (!req.body.category) {
            return res.status(400).send("This field is required");
        }
        
        if (!req.body.status) {
            return res.status(400).send("This field is required");
        }

        

        const inventoryItem = {
            warehouseID: req.body.warehouseID,
            warehouseName: req.body.warehouseName,
            itemName: req.body.itemName,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            quantity: req.body.quantity,
        };

         // Create new inventory object with ID
         const newInventoryItem = {
            id: crypto.randomUUID(),
            ...inventoryItem,
        }

        const inventories = readInventoryList();

        inventories.push(newInventoryItem);

        WriteInventories(inventories);

        res.status(201).json(newInventoryItem)
    })

router.route("/:inventoryId")
    .get((req, res) => {
    res.send("Get request to inventory ID: " + req.params.inventoryId);
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