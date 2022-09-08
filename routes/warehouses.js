const express = require("express");
const router = express.Router();
const fs = require("fs");
const crypto = require("crypto");

const warehouseFilePath = "./data/warehouses.json";

function readWarehouses() {
    const warehousesFile = fs.readFileSync(warehouseFilePath);
    const warehousesData = JSON.parse(warehousesFile);
    return warehousesData;
}

function WriteWarehouses(warehouses) {
    fs.writeFileSync(warehouseFilePath, JSON.stringify(warehouses));
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
        const requestBody = req.body;
        const requestedValuesInArray = [
            requestBody.name,
            requestBody.address,
            requestBody.city,
            requestBody.country,
            requestBody.contact.name,
            requestBody.contact.position,
            requestBody.contact.phone,
            requestBody.contact.email
        ];

        const includesEmptyString = requestedValuesInArray.includes("");
        if (includesEmptyString) {
            res.status(400).json({message: "there's some empty values"})
        }
        res.send("No empty values")

        const requestedWarehouse = {
            id: crypto.randomUUID(),
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            contact: {
                name: req.body.contact.name,
                position: req.body.contact.position,
                phone: req.body.contact.phone,
                email: req.body.contact.email
            }
        }

        if (true) {
            const errorMessages = {
                name: "",
                address: "",
                city: "",
                country: "",
                contact: {
                    name: "",
                    position: "",
                    phone: "",
                    email: ""
                }
            }
            res.status(400).json(errorMessages);
        }

        const warehouses = readWarehouses();
        warehouses.push(requestedWarehouse);

        WriteWarehouses(warehouses);

        res.json(warehouses);
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