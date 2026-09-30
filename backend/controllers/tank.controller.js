import mongoose from "mongoose"
import Tank from "../models/tank.model.js"
import Nozzle from "../models/nozzle.model.js"

export const getTanks = async (req, res) => {
    try {
        const petrolPumpId = req.user.petrolPumpId;
        const tanks = await Tank.find({ petrolPumpId }).sort({ createdAt: -1 })
        return res.status(200).json(tanks)
    } catch (error) {
        console.log("Error in getTanks controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getTank = async (req, res) => {
    try {
        const tankId = req.params.id
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(tankId)) {
            return res.status(400).json({ message: "Invalid tank id" });
        }

        const tank = await Tank.findOne({ _id: tankId, petrolPumpId });
        if (!tank) {
            return res.status(404).json({ message: "Tank not found" })
        }
        return res.status(200).json(tank)
    } catch (error) {
        console.log("Error in getTank controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const createTank = async (req, res) => {
    try {
        const { name, tankNumber, fuelType, capacity, currentQuantity } = req.body
        const petrolPumpId = req.user.petrolPumpId;

        const existingTank = await Tank.findOne({ tankNumber, petrolPumpId })
        if (existingTank) {
            return res.status(409).json({ message: "Tank number already exists in your petrol pump" })
        }

        const newTank = await Tank.create({
            name,
            tankNumber,
            fuelType,
            capacity,
            currentQuantity,
            petrolPumpId,
        })
        return res.status(201).json({ newTank, message: "Tank created successfully" })

    } catch (error) {
        console.log("Error in createTank controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateTank = async (req, res) => {
    try {
        const { name, tankNumber, capacity, isActive } = req.body;
        const tankId = req.params.id
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(tankId)) {
            return res.status(400).json({ message: "Invalid tank id" });
        }

        const tank = await Tank.findOne({ _id: tankId, petrolPumpId })
        if (!tank) {
            return res.status(404).json({ message: "Tank not found" });
        }

        const occupiedNozzle = await Nozzle.findOne({ tankId, petrolPumpId, isOccupied: true })
        if (occupiedNozzle) {
            return res.status(409).json({
                message: "Cannot modify tank while one or more nozzles are occupied",
            });
        }

        if (capacity !== undefined && capacity < tank?.currentQuantity) {
            return res.status(400).json({
                message: "Capacity cannot be less than the current fuel quantity"
            })
        }

        const updates = {}

        if (tankNumber) {
            const existingTank = await Tank.findOne({
                tankNumber,
                petrolPumpId,
                _id: { $ne: tankId },
            });
            if (existingTank) {
                return res.status(409).json({ message: "Tank number already exists in your petrol pump" });
            }
            updates.tankNumber = tankNumber;
        }
        if (name) updates.name = name;
        if (capacity !== undefined) updates.capacity = capacity
        if (isActive !== undefined) updates.isActive = isActive

        const updatedTank = await Tank.findOneAndUpdate(
            { _id: tankId, petrolPumpId },
            updates,
            { runValidators: true, returnDocument: 'after' }
        )

        return res.status(200).json({
            updatedTank, message: "Tank updated successfully"
        })
    } catch (error) {
        console.log("Error in updateTank controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteTank = async (req, res) => {
    try {
        const tankId = req.params.id
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(tankId)) {
            return res.status(400).json({ message: "Invalid tank id" });
        }

        const tank = await Tank.findOne({ _id: tankId, petrolPumpId })
        if (!tank) {
            return res.status(404).json({ message: "Tank not found" })
        }

        const occupiedNozzle = await Nozzle.findOne({
            tankId,
            petrolPumpId,
            isOccupied: true,
        });

        if (occupiedNozzle) {
            return res.status(409).json({
                message: "Cannot delete tank while one or more connected nozzles are occupied",
            });
        }
        await Tank.findOneAndDelete({ _id: tankId, petrolPumpId })
        return res.status(200).json({ message: "Tank deleted successfully" })

    } catch (error) {
        console.log("Error in deleteTank controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}