import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
    petrolPumpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetrolPump",
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Machine",
        required: true
    },
    nozzles: [{
        nozzleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nozzle",
            required: true
        },
        openingReading: {
            type: Number,
            required: true
        },
        pricePerLitre: {
            type: Number,
            min: 0
        },
        fuelType : {
            type : String,
            enum : ['PETROL', 'DIESEL', 'PREMIUM']
        },

        closingReading: Number,

        fuelSold: Number,

        amount: Number
    }],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,

    totalFuelSold: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["ONGOING", "COMPLETED"],
        default: "ONGOING"
    },
}, { timestamps: true });

shiftSchema.index({ petrolPumpId: 1, status: 1, startTime: -1 });
shiftSchema.index({ petrolPumpId: 1, employeeId: 1, startTime: -1 });

const Shift = mongoose.model('Shift', shiftSchema)
export default Shift