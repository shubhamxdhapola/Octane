import mongoose from "mongoose";
import Shift from "../models/shift.model.js";
import getDateRange from "../utils/getDateRange.js";

export const getTopMachine = async (petrolPumpId, period = "today", startDate, endDate) => {
    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const match = {
        status: "COMPLETED",
        endTime: {
            $gte: sDate,
            $lte: eDate,
        },
    };
    if (petrolPumpId) {
        match.petrolPumpId = new mongoose.Types.ObjectId(petrolPumpId);
    }

    const result = await Shift.aggregate([
        {
            $match: match,
        },
        {
            $group: {
                _id: "$machineId",
                revenue: { $sum: "$totalAmount" },
                fuelSold: { $sum: "$totalFuelSold" },
            },
        },
        {
            $sort: {
                revenue: -1,
            },
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: "machines",
                localField: "_id",
                foreignField: "_id",
                as: "machine",
            },
        },
        {
            $unwind: "$machine",
        },
        {
            $project: {
                _id: 0,
                machineId: "$machine._id",
                name: "$machine.name",
                machineNumber: "$machine.machineNumber",
                revenue: 1,
                fuelSold: 1,
            },
        },
    ]);

    return result.length > 0 ? {
        topMachine: result[0],
        rankings: result,
        totalMachinesCount: result.length
    } : null;
};

export const getMachinePerformance = async (
    machineId,
    petrolPumpId,
    period = "today",
    startDate,
    endDate
) => {
    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const match = {
        machineId: new mongoose.Types.ObjectId(machineId),
        status: "COMPLETED",
        endTime: {
            $gte: sDate,
            $lte: eDate,
        },
    };
    if (petrolPumpId) {
        match.petrolPumpId = new mongoose.Types.ObjectId(petrolPumpId);
    }

    const result = await Shift.aggregate([
        {
            $match: match,
        },
        {
            $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                fuelSold: { $sum: "$totalFuelSold" },
                shifts: { $sum: 1 },
            },
        },
    ]);

    return result[0] || null;
};