import Tank from "../models/tank.model.js";

export const getLowFuelTanks = async (petrolPumpId) => {
    const filter = { isActive: true };
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    const tanks = await Tank.find(filter);

    return tanks
        .map((tank) => ({
            id: tank._id,
            name: tank.name,
            fuelType: tank.fuelType,
            capacity: tank.capacity,
            remaining: tank.currentQuantity,
            percentage: Number(
                (
                    (tank.currentQuantity / tank.capacity) *
                    100
                ).toFixed(1)
            ),
        }))
        .filter((tank) => tank.percentage <= 20);
};

export const getTankByFuelType = async (fuelType, petrolPumpId) => {
    const filter = {
        fuelType: fuelType.toUpperCase(),
        isActive: true,
    };
    if (petrolPumpId) filter.petrolPumpId = petrolPumpId;

    return await Tank.findOne(filter).select("name fuelType capacity currentQuantity");
};