const express = require("express");
const router = express.Router();
const fs = require("fs");

function readWarehouses() {
    const warehousesFile = fs.readFileSync("./data/warehouses.json");
    const warehousesData = JSON.parse(warehousesFile);
    return warehousesData;
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
        const warehouses = readWarehouses();
        const singleWarehouse = warehouses.find((warehouse) => warehouse.id === req.params.warehouseId)

    if (!singleWarehouse) {
        return res.status(404).json({error: "Warehouse not found. Please enter a valid warehouse ID."});
    }
    res.status(200).json(singleWarehouse);
})
    .put((req, res) => {
    res.send("Put request to warehouse ID: " + req.params.warehouseId);
})

module.exports = router;