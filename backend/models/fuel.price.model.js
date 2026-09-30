import mongoose from "mongoose";

const fuelPriceSchema = new mongoose.Schema({
    petrolPumpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetrolPump",
        required: true,
    },
    fuelType: {
        type: String,
        enum: ['PETROL', 'DIESEL', 'PREMIUM'],
        required: true,
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    effectiveFrom: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

fuelPriceSchema.index({ petrolPumpId: 1, fuelType: 1, effectiveFrom: -1 });

const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema)
export default FuelPrice