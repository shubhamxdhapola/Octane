import { getFuelSoldChart, getFuelSoldSummary, getOverviewCards, getRecentShifts, getRevenueChart, getTankStatus } from '../services/dashboard.service.js';
import getDateRange from '../utils/getDateRange.js'

export const getDashboardData = async (req, res) => {
    try {
        const petrolPumpId = req.user.petrolPumpId;
        const { period = "today" } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const overview = await getOverviewCards(petrolPumpId, startDate, endDate);
        const revenueChart = await getRevenueChart(petrolPumpId, startDate, endDate, period);
        const fuelSoldChart = await getFuelSoldChart(petrolPumpId, startDate, endDate, period);
        const fuelSoldSummary = await getFuelSoldSummary(petrolPumpId, startDate, endDate);
        const tankStatus = await getTankStatus(petrolPumpId);
        const recentShifts = await getRecentShifts(petrolPumpId);

        return res.status(200).json({
            overview,
            revenueChart,
            fuelSoldChart,
            fuelSoldSummary,
            tankStatus,
            recentShifts
        });
    } catch (error) {
        console.log("Error in getDashboard controller :", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


