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
        let quantity = req.body.quantity;

        // If in stock, quantity can't be 0. If out of stock, 0 is converted to truthy value
        if (req.body.status === "In Stock") {
            quantity = req.body.quantity;
        } else {
            quantity = (req.body.quantity).toString();
        };

        const inventoryItemArray = [
            req.body.itemName,
            req.body.description,
            req.body.category,
            req.body.status,
            quantity,
            req.body.warehouseName,
            req.body.warehouseID,
        ];

        const errorMessagesArray = [];

        inventoryItemArray.forEach((value, index) => {
            errorMessagesArray[index] = value ? "" : "This field is required";
        });

        // If non-empty values in error array,
        // return error status code with error messages
        const indexOfTruthyValue = errorMessagesArray.findIndex(message => !!message);
        if (indexOfTruthyValue !== -1) {
            return res.status(400).json(errorMessagesArray);
        }

         // Create new inventory object with ID
         const newInventoryItem = {
            id: crypto.randomUUID(),
            warehouseID: req.body.warehouseID,
            warehouseName: req.body.warehouseName,
            itemName: req.body.itemName,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status,
            quantity: req.body.quantity
        }

        const inventories = readInventoryList();
        inventories.push(newInventoryItem);
        WriteInventories(inventories);

        res.status(201).json(newInventoryItem)
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
        const inventories = readInventoryList();
        let foundInventoryById = inventories.find((inventory) => {
            return inventory.id === req.params.inventoryId;
        });

        // First error checking with ID
        if (!foundInventoryById) {
            return res.status(404).json({error: "Inventory item not found. Please enter a valid ID."});
        }

        const reqBodyValuesArr = [
            req.body.itemName,
            req.body.description,
            req.body.category,
            req.body.status,
            req.body.quantity,
            req.body.warehouseName
        ]

        const errorMessagesArr = reqBodyValuesArr.map((value) => {
            return (value||value===0) ? "" : "This field is required";
        })

        // If non-empty values in error array,
        // return error status code with error messages
        const indexOfTruthyValue = errorMessagesArr.findIndex(message => !!message);
        if (indexOfTruthyValue !== -1) {
            return res.status(400).json(errorMessagesArr);
        }

        foundInventoryById.itemName = req.body.itemName;
        foundInventoryById.description = req.body.description;
        foundInventoryById.category = req.body.category;
        foundInventoryById.status = req.body.status;
        foundInventoryById.quantity = req.body.quantity;
        foundInventoryById.warehouseName = req.body.warehouseName;
        foundInventoryById.warehouseID = req.body.warehouseId;

        WriteInventories(inventories);
        res.json(foundInventoryById);
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