import mongoose from "mongoose";
import Machine from "../models/machine.model.js";
import Nozzle from "../models/nozzle.model.js";
import Shift from "../models/shift.model.js";
import getDateRange from "../utils/getDateRange.js";

export const getMachines = async (req, res) => {
    try {
        const petrolPumpId = req.user.petrolPumpId;
        const machines = await Machine.find({ petrolPumpId }).sort({ createdAt: -1 });
        return res.status(200).json(machines);
    } catch (error) {
        console.log("Error in getMachines controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getMachine = async (req, res) => {
    try {
        const machineId = req.params.id;
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(machineId)) {
            return res.status(400).json({ message: "Invalid machine id", });
        }

        const machine = await Machine.findOne({ _id: machineId, petrolPumpId });

        if (!machine) {
            return res.status(404).json({ message: "Machine not found", });
        }
        return res.status(200).json(machine);
    } catch (error) {
        console.log("Error in getMachine controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const createMachine = async (req, res) => {
    try {
        const { name, machineNumber } = req.body;
        const petrolPumpId = req.user.petrolPumpId;

        const existingMachine = await Machine.findOne({ machineNumber, petrolPumpId });

        if (existingMachine) {
            return res.status(409).json({ message: "Machine number already exists in your petrol pump" });
        }

        const newMachine = await Machine.create({
            name,
            machineNumber,
            petrolPumpId,
        });

        return res.status(201).json({
            machine: newMachine,
            message: "Machine created successfully",
        });
    } catch (error) {
        console.log("Error in createMachine controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateMachine = async (req, res) => {
    try {
        const { name, machineNumber, isActive } = req.body;
        const machineId = req.params.id;
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(machineId)) {
            return res.status(400).json({ message: "Invalid machine id" });
        }

        const machine = await Machine.findOne({ _id: machineId, petrolPumpId });

        if (!machine) {
            return res.status(404).json({ message: "Machine not found", });
        }

        const occupiedNozzle = await Nozzle.findOne({
            machineId,
            petrolPumpId,
            isOccupied: true
        })

        if (occupiedNozzle) {
            return res.status(409).json({
                message: "Cannot modify machine while one or more nozzles are occupied",
            });
        }

        const updates = {};

        if (machineNumber) {
            const existingMachine = await Machine.findOne({
                machineNumber,
                petrolPumpId,
                _id: { $ne: machineId },
            });

            if (existingMachine) {
                return res.status(409).json({ message: "Machine number already exists in your petrol pump", });
            }
            updates.machineNumber = machineNumber;
        }

        if (name) updates.name = name;

        if (typeof isActive !== "undefined") {
            updates.isActive = isActive;
        }

        const updatedMachine = await Machine.findOneAndUpdate(
            { _id: machineId, petrolPumpId },
            updates,
            { runValidators: true, returnDocument: "after", }
        );

        return res.status(200).json({
            machine: updatedMachine,
            message: "Machine updated successfully",
        });
    } catch (error) {
        console.log("Error in updateMachine controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteMachine = async (req, res) => {
    try {
        const machineId = req.params.id;
        const petrolPumpId = req.user.petrolPumpId;

        if (!mongoose.Types.ObjectId.isValid(machineId)) {
            return res.status(400).json({ message: "Invalid machine id" });
        }

        const machine = await Machine.findOne({ _id: machineId, petrolPumpId });

        if (!machine) {
            return res.status(404).json({ message: "Machine not found" });
        }

        const occupiedNozzle = await Nozzle.findOne({
            machineId,
            petrolPumpId,
            isOccupied: true,
        });

        if (occupiedNozzle) {
            return res.status(409).json({
                message: "Cannot delete machine while one or more nozzles are occupied",
            });
        }

        const nozzleCount = await Nozzle.countDocuments({ machineId, petrolPumpId });

        if (nozzleCount > 0) {
            return res.status(409).json({
                message: "Remove all nozzles before deleting this machine",
            });
        }

        await Machine.findOneAndDelete({ _id: machineId, petrolPumpId });
        return res.status(200).json({ message: "Machine deleted successfully" });

    } catch (error) {
        console.log("Error in deleteMachine controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getMachineSalesSummary = async (req, res) => {
    try {
        const petrolPumpId = req.user.petrolPumpId;
        const machines = await Machine.find({ petrolPumpId }).sort({ name: 1 });
        
        const ranges = {
            today: getDateRange("today"),
            seven: getDateRange("7"),
            fifteen: getDateRange("15"),
            thirty: getDateRange("30")
        };

        const [todaySales, sevenSales, fifteenSales, thirtySales] = await Promise.all([
            getSalesForPeriod(petrolPumpId, ranges.today.startDate, ranges.today.endDate),
            getSalesForPeriod(petrolPumpId, ranges.seven.startDate, ranges.seven.endDate),
            getSalesForPeriod(petrolPumpId, ranges.fifteen.startDate, ranges.fifteen.endDate),
            getSalesForPeriod(petrolPumpId, ranges.thirty.startDate, ranges.thirty.endDate)
        ]);

        const mapSales = (salesList) => {
            const map = {};
            salesList.forEach(item => {
                map[item._id.toString()] = item.totalFuelSold;
            });
            return map;
        };

        const todayMap = mapSales(todaySales);
        const sevenMap = mapSales(sevenSales);
        const fifteenMap = mapSales(fifteenSales);
        const thirtyMap = mapSales(thirtySales);

        const summary = machines.map(machine => {
            const idStr = machine._id.toString();
            return {
                machineId: machine._id,
                name: machine.name,
                machineNumber: machine.machineNumber,
                isActive: machine.isActive,
                today: todayMap[idStr] || 0,
                seven: sevenMap[idStr] || 0,
                fifteen: fifteenMap[idStr] || 0,
                thirty: thirtyMap[idStr] || 0
            };
        });

        return res.status(200).json(summary);
    } catch (error) {
        console.log("Error in getMachineSalesSummary controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSalesForPeriod = async (petrolPumpId, startDate, endDate) => {
    const match = {
        status: "COMPLETED",
        endTime: { $gte: startDate, $lte: endDate }
    };
    if (petrolPumpId) {
        match.petrolPumpId = new mongoose.Types.ObjectId(petrolPumpId);
    }

    return await Shift.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$machineId",
                totalFuelSold: { $sum: "$totalFuelSold" }
            }
        }
    ]);
};
