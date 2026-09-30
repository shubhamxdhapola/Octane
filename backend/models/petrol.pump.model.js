import mongoose from "mongoose";

const petrolPumpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Petrol pump name is required"],
      trim: true,
      minlength: [2, "Petrol pump name must be at least 2 characters"],
      maxlength: [100, "Petrol pump name cannot exceed 100 characters"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [50, "City cannot exceed 50 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [50, "State cannot exceed 50 characters"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid 6-digit Indian pincode"],
    },
    contactPhone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid contact phone number"],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

petrolPumpSchema.index({ ownerId: 1 });
petrolPumpSchema.index({ city: 1, state: 1 });

const PetrolPump = mongoose.model("PetrolPump", petrolPumpSchema);

export default PetrolPump;
