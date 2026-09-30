import mongoose from "mongoose";
import PetrolPump from "../models/petrol.pump.model.js";

export const getPetrolPumpProfile = async (req, res) => {
  try {
    const petrolPumpId = req.user.petrolPumpId;
    if (!petrolPumpId) {
      return res.status(404).json({ message: "No petrol pump associated with this account" });
    }

    const petrolPump = await PetrolPump.findById(petrolPumpId).populate("ownerId", "name phone role");
    if (!petrolPump) {
      return res.status(404).json({ message: "Petrol pump not found" });
    }

    const pumpObj = petrolPump.toObject ? petrolPump.toObject() : petrolPump;
    return res.status(200).json({
      ...pumpObj,
      petrolPump: pumpObj,
    });
  } catch (error) {
    console.error("Error in getPetrolPumpProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePetrolPumpProfile = async (req, res) => {
  try {
    const petrolPumpId = req.user.petrolPumpId;
    if (!petrolPumpId) {
      return res.status(404).json({ message: "No petrol pump associated with this account" });
    }

    const { name, address, city, state, pincode, contactPhone, contactEmail } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (address) updates.address = address;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (pincode) updates.pincode = pincode;
    if (contactPhone) updates.contactPhone = contactPhone;
    if (contactEmail) updates.contactEmail = contactEmail;

    const updatedPump = await PetrolPump.findByIdAndUpdate(
      petrolPumpId,
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedPump) {
      return res.status(404).json({ message: "Petrol pump not found" });
    }

    return res.status(200).json({
      petrolPump: updatedPump,
      message: "Petrol pump profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updatePetrolPumpProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
