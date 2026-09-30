import getDateRange from "../utils/getDateRange.js";
import { getOverviewCards, getFuelSoldSummary, getTankStatus, } from "./dashboard.service.js";
import { getTopEmployee } from "./employee.service.js";
import { getTopMachine } from "./machine.service.js";
import { getCurrentFuelPrices } from "./fuel.price.service.js";
import { getRecentTankRefills, getTotalRefilled, } from "./tank.refill.service.js";

export const generateDailyReport = async (petrolPumpId, period = "today", startDate, endDate) => {

    const { startDate: sDate, endDate: eDate } = getDateRange(period, startDate, endDate);

    const [
        overview,
        fuelSummary,
        tankStatus,
        topEmployee,
        topMachine,
        fuelPrices,
        recentRefills,
        totalRefilled
    ] = await Promise.all([

        getOverviewCards(petrolPumpId, sDate, eDate),
        getFuelSoldSummary(petrolPumpId, sDate, eDate),
        getTankStatus(petrolPumpId),
        getTopEmployee(petrolPumpId, period, startDate, endDate),
        getTopMachine(petrolPumpId, period, startDate, endDate),
        getCurrentFuelPrices(petrolPumpId),
        getRecentTankRefills(petrolPumpId, period, startDate, endDate),
        getTotalRefilled(petrolPumpId, period, startDate, endDate)

    ]);

    return {
        generatedAt: new Date(),
        period,
        startDate: sDate,
        endDate: eDate,
        overview,
        fuelSummary,
        tankStatus,
        fuelPrices,
        recentRefills,
        totalRefilled,
        topEmployee,
        topMachine
    };

};