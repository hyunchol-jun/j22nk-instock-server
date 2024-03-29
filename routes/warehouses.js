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
function readInventoryList() {
    const inventoriesListFile = fs.readFileSync("./data/inventories.json");
    const inventoryListData = JSON.parse(inventoriesListFile);
    return inventoryListData
}

function writeWarehouses(warehouses) {
    fs.writeFileSync(warehouseFilePath, JSON.stringify(warehouses));
}

function isPhoneNumber(phoneNumber) {
    // Define regular expression rule
    const regex = /^\+?[0-9]? ?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    // Return true or false depending on the match result
    return regex.test(phoneNumber);
}

function isEmailAddress(email) {
    // Define regular expression ruleset
    const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    // Return true or false depending on the match result
    return regex.test(email);
}

function stringFromArray(array, startIndex, length) {
    let resultString = "";
    for (let i = startIndex; i < startIndex + length; i++) {
        resultString += array[i];
    }
    return resultString;
}

function convertPhoneNumber(phoneNumber) {
    const arrayedPhoneNumber = phoneNumber.split("");
    const onlyNumbers = arrayedPhoneNumber.filter((char) => !isNaN(char));
    let newPhoneNumber = "";

    if (onlyNumbers.length === 11) {
        newPhoneNumber = newPhoneNumber + "+" + onlyNumbers[0] + " (";
        onlyNumbers.splice(0, 1); 
    } else {
        newPhoneNumber += "+1 (";
    }

    newPhoneNumber += stringFromArray(onlyNumbers, 0, 3);
    newPhoneNumber += ") ";
    newPhoneNumber += stringFromArray(onlyNumbers, 3, 3);
    newPhoneNumber += "-";
    newPhoneNumber += stringFromArray(onlyNumbers, 6, 4);

    return newPhoneNumber;
}

function makeErrorMessagesArrayWithValues(requestedValuesInArray) {
    const errorMessagesArray = [];

    requestedValuesInArray.forEach((value, index) => {
        errorMessagesArray[index] = value ? "" : "This field is required";
    })

    const PHONE_INDEX = 6;
    const EMAIL_INDEX = 7;

    // Test if valid phone number only when it's not empty string
    if (requestedValuesInArray[PHONE_INDEX]) {
        errorMessagesArray[PHONE_INDEX] = 
            isPhoneNumber(requestedValuesInArray[PHONE_INDEX])
            ? ""
            : "Enter a valid phone number";
    }

    // Test if valid email address only when it's not empty string
    if (requestedValuesInArray[EMAIL_INDEX]) {
        errorMessagesArray[EMAIL_INDEX] = 
            isEmailAddress(requestedValuesInArray[EMAIL_INDEX])
            ? ""
            : "Enter a valid email address";
    }

    return errorMessagesArray;
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
        const requestedValuesInArray = [
            req.body.name,
            req.body.address,
            req.body.city,
            req.body.country,
            req.body.contact.name,
            req.body.contact.position,
            req.body.contact.phone,
            req.body.contact.email
        ];

        const errorMessagesArray = makeErrorMessagesArrayWithValues(requestedValuesInArray);

        // If non-empty values in error array,
        // return error status code with error messages
        const indexOfTruthyValue = errorMessagesArray.findIndex(message => !!message);
        if (indexOfTruthyValue !== -1) {
            return res.status(400).json(errorMessagesArray);
        }

        // Create new object with ID, with formatted phone number
        const requestedWarehouse = {
            id: crypto.randomUUID(),
            ...req.body,
        }
        requestedWarehouse.contact.phone = convertPhoneNumber(req.body.contact.phone);

        // Read warehouse data and append new object to it
        const warehouses = readWarehouses();
        warehouses.push(requestedWarehouse);

        writeWarehouses(warehouses);

        res.status(201).json(requestedWarehouse);
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
        const warehouses = readWarehouses();
        let foundWarehouseById = warehouses.find((warehouse) => warehouse.id === req.params.warehouseId);

        // First error checking with ID
        if (!foundWarehouseById) {
            return res.status(404).json({error: "Warehouse not found. Please enter a valid warehouse ID."});
        }

        // Error checking with values
        const requestedValuesInArray = [
            req.body.name,
            req.body.address,
            req.body.city,
            req.body.country,
            req.body.contact.name,
            req.body.contact.position,
            req.body.contact.phone,
            req.body.contact.email
        ];

        const errorMessagesArray = makeErrorMessagesArrayWithValues(requestedValuesInArray);

        // If non-empty values in error array,
        // return error status code with error messages
        const indexOfTruthyValue = errorMessagesArray.findIndex(message => !!message);
        if (indexOfTruthyValue !== -1) {
            return res.status(400).json(errorMessagesArray);
        }

        // Update the values
        foundWarehouseById.name = req.body.name;
        foundWarehouseById.address = req.body.address;
        foundWarehouseById.city = req.body.city;
        foundWarehouseById.country = req.body.country;
        foundWarehouseById.contact = req.body.contact;

        writeWarehouses(warehouses);
        res.status(200).json(foundWarehouseById);
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
        res.status(200).json({message: `The specified warehouse (id: ${req.params.warehouseId}) along with it's associated inventory (if any) was deleted successfully!`});
    })


module.exports = router;