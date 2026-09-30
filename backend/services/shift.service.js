import Shift from "../models/shift.model.js";
import getDateRange from "../utils/getDateRange.js";

export const getOngoingShifts = async (petrolPumpId) => {
    const filter = { status: "ONGOING" };
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    return await Shift.find(filter)
        .populate("employeeId", "name")
        .populate("machineId", "name machineNumber")
        .sort({
            startTime: -1,
        });
};

export const getCompletedShifts = async (petrolPumpId, period = "today", startDate, endDate) => {
    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const filter = {
        status: "COMPLETED",
        endTime: {
            $gte: sDate,
            $lte: eDate,
        },
    };
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    return await Shift.find(filter)
        .populate("employeeId", "name")
        .populate("machineId", "name machineNumber")
        .sort({
            endTime: -1,
        });
};