import FuelPrice from "../models/fuel.price.model.js";

const getCurrentFuelPrices = async (petrolPumpId, session = null) => {
    const filter = (fuelType) => {
        const f = { fuelType };
        if (petrolPumpId) f.petrolPumpId = petrolPumpId;
        return f;
    };

    const [petrol, diesel, premium] = await Promise.all([
        FuelPrice.findOne(filter("PETROL"))
            .sort({ effectiveFrom: -1 })
            .session(session),

        FuelPrice.findOne(filter("DIESEL"))
            .sort({ effectiveFrom: -1 })
            .session(session),

        FuelPrice.findOne(filter("PREMIUM"))
            .sort({ effectiveFrom: -1 })
            .session(session),
    ]);

    return { PETROL: petrol, DIESEL: diesel, PREMIUM: premium };
};

export default getCurrentFuelPrices