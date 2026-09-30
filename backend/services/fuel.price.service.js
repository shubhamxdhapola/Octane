import mongoose from "mongoose";
import FuelPrice from "../models/fuel.price.model.js";
import getDateRange from "../utils/getDateRange.js";

export const getCurrentFuelPrices = async (petrolPumpId) => {
    const match = {};
    if (petrolPumpId) {
        match.petrolPumpId = mongoose.Types.ObjectId.isValid(petrolPumpId)
            ? new mongoose.Types.ObjectId(petrolPumpId)
            : petrolPumpId;
    }

    const prices = await FuelPrice.aggregate([
        {
            $match: match
        },
        {
            $sort: {
                effectiveFrom: -1
            }
        },
        {
            $group: {
                _id: "$fuelType",
                price: {
                    $first: "$price"
                },
                effectiveFrom: {
                    $first: "$effectiveFrom"
                }
            }
        }
    ]);

    const result = {};

    prices.forEach(price => {
        result[price._id.toLowerCase()] = {
            price: price.price,
            effectiveFrom: price.effectiveFrom
        };
    });

    return result;
};

export const getFuelPriceHistory = async (petrolPumpId, period = "7", startDate, endDate) => {

    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const filter = {
        effectiveFrom: {
            $gte: sDate,
            $lte: eDate
        }
    };
    if (petrolPumpId) {
        filter.petrolPumpId = petrolPumpId;
    }

    return await FuelPrice.find(filter)
        .sort({
            effectiveFrom: -1
        });

};