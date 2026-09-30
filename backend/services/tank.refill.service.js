import mongoose from "mongoose";
import TankRefill from "../models/tank.refill.model.js";
import getDateRange from "../utils/getDateRange.js";

export const getRecentTankRefills = async (petrolPumpId, period = "today", startDate, endDate) => {
    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const filter = {
        refillDate: {
            $gte: sDate,
            $lte: eDate,
        },
    };
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    return await TankRefill.find(filter)
        .populate("tankId", "name fuelType")
        .sort({
            refillDate: -1,
        });

};

export const getLastRefill = async (petrolPumpId) => {
    const filter = {};
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    return await TankRefill.findOne(filter)
        .populate("tankId", "name fuelType")
        .sort({
            refillDate: -1,
        });

};

export const getTotalRefilled = async (petrolPumpId, period = "today", startDate, endDate) => {
    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const match = {
        refillDate: {
            $gte: sDate,
            $lte: eDate,
        },
    };
    if (petrolPumpId) match.petrolPumpId = new mongoose.Types.ObjectId(petrolPumpId);

    const result = await TankRefill.aggregate([
        {
            $match: match,
        },
        {
            $lookup: {
                from: "tanks",
                localField: "tankId",
                foreignField: "_id",
                as: "tank",
            },
        },
        {
            $unwind: "$tank",
        },
        {
            $group: {
                _id: "$tank.fuelType",
                quantity: {
                    $sum: "$quantity",
                },
                amount: {
                    $sum: {
                        $multiply: ["$quantity", "$pricePerLitre"],
                    },
                },
            },
        },
    ]);

    const summary = {
        petrol: {
            quantity: 0,
            amount: 0,
        },
        diesel: {
            quantity: 0,
            amount: 0,
        },
        premium: {
            quantity: 0,
            amount: 0,
        },
        totalQuantity: 0,
        totalAmount: 0,
    };

    result.forEach((item) => {
        const fuelType = item._id.toLowerCase();

        if (summary[fuelType]) {
            summary[fuelType] = {
                quantity: item.quantity,
                amount: item.amount,
            };
        }

        summary.totalQuantity += item.quantity;
        summary.totalAmount += item.amount;
    });

    return summary;
};