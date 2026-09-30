import mongoose from "mongoose";

const tankRefillSchema = new mongoose.Schema({
    petrolPumpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetrolPump",
        required: true,
    },
    tankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tank",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be greater than 0"],
    },
    pricePerLitre : {
        type : Number,
        required : true
    },
    refillDate: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: [200, "Remarks cannot exceed 200 characters"],
    },
}, { timestamps: true, });

tankRefillSchema.index({ petrolPumpId: 1, tankId: 1, refillDate: -1 });

const TankRefill = mongoose.model("TankRefill", tankRefillSchema);

export default TankRefill;