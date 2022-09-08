const express = require("express");
const router = express.Router();
const fs = require("fs");

function readWarehouses() {
    const warehousesFile = fs.readFileSync("./data/warehouses.json");
    const warehousesData = JSON.parse(warehousesFile);
    return warehousesData;
}
function readInventoryList() {
    const inventoriesListFile = fs.readFileSync("./data/inventories.json");
    const inventoryListData = JSON.parse(inventoriesListFile);
    return inventoryListData
}

// GET all warehouses
router.route("/")
    .get((req, res) => {
        const warehouses = readWarehouses();
        const listOfWarehouses = warehouses.map((warehouse) => {
            return (
                {
                    "id": warehouse.id,
                    "name": warehouse.name,
                    "address": warehouse.address,
                    "city": warehouse.city,
                    "country": warehouse.country,
                    "contact": {
                        "name": warehouse.contact.name,
                        "position": warehouse.contact.position,
                        "phone": warehouse.contact.phone,
                        "email": warehouse.contact.email
                    }
                }
            )
        })
        res.status(200).json(listOfWarehouses);
    })
    .post((req, res) => {
        res.send("Post request to warehouses");
    })

router.route("/:warehouseId")
    .get((req, res) => {
    res.send("Get request to warehouse ID: " + req.params.warehouseId);
    })
    .put((req, res) => {
    res.send("Put request to warehouse ID: " + req.params.warehouseId);
    })
    .delete((req, res) => {
        const warehouses = readWarehouses();
        const filteredWarehouses = warehouses.filter((warehouse) => {
            return warehouse.id !== req.params.warehouseId;
        })
        fs.writeFileSync("./data/warehouses.json", JSON.stringify(filteredWarehouses));

        const inventories = readInventoryList();
        const filteredInventories = inventories.filter((inventory) => {
            return inventory.warehouseID !== req.params.warehouseId;
        })
        fs.writeFileSync("./data/inventories.json", JSON.stringify(filteredInventories));
        res.status(200).json({message: `The specified warehouse (id: ${req.params.warehouseId}) along with it's associated inventory was deleted successfully!`});
    })


module.exports = router;