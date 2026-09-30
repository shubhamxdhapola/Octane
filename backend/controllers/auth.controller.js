import mongoose from "mongoose";
import User from "../models/user.model.js";
import PetrolPump from "../models/petrol.pump.model.js";
import { generateToken } from "../utils/generateToken.js";
import { saveCookie } from "../utils/saveCookie.js";

export const register = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const {
            ownerName,
            phone,
            password,
            petrolPumpName,
            address,
            city,
            state,
            pincode,
            email,
        } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: "Phone number is already registered" });
        }

        session.startTransaction();

        // 1. Create owner user with role 'admin'
        const tempPumpId = new mongoose.Types.ObjectId();
        const [newUser] = await User.create(
            [
                {
                    name: ownerName,
                    phone,
                    password,
                    role: "admin",
                    petrolPumpId: tempPumpId,
                },
            ],
            { session }
        );

        // 2. Create PetrolPump with ownerId
        const [newPump] = await PetrolPump.create(
            [
                {
                    _id: tempPumpId,
                    name: petrolPumpName,
                    ownerId: newUser._id,
                    address,
                    city,
                    state,
                    pincode,
                    contactPhone: phone,
                    contactEmail: email || undefined,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        const token = generateToken(newUser._id, newUser.tokenVersion);
        saveCookie(token, req, res);

        return res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role,
                isActive: newUser.isActive,
                petrolPumpId: newPump._id,
                petrolPump: {
                    id: newPump._id,
                    name: newPump.name,
                    city: newPump.city,
                    state: newPump.state,
                },
                createdAt: newUser.createdAt,
            },
            message: "Petrol pump registered successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("Error in register controller : ", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await session.endSession();
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone })
            .select('+password +tokenVersion')
            .populate('petrolPumpId', 'name city state address pincode isActive');

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated" });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user?.tokenVersion);
        saveCookie(token, req, res);

        const pump = user.petrolPumpId;

        return res.status(200).json({
            token,
            user: {
                id: user?._id,
                name: user?.name,
                phone: user?.phone,
                role: user?.role,
                isActive: user?.isActive,
                petrolPumpId: pump?._id || user.petrolPumpId,
                petrolPump: pump ? {
                    id: pump._id,
                    name: pump.name,
                    city: pump.city,
                    state: pump.state,
                    address: pump.address,
                    pincode: pump.pincode,
                } : null,
                createdAt: user?.createdAt,
            },
            message: "Logged in successfully",
        });

    } catch (error) {
        console.log("Error in login controller : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        const isLocalhost = req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1');
        res.clearCookie('token', {
            httpOnly: true,
            secure: !isLocalhost,
            sameSite: isLocalhost ? "Lax" : "none",
        });
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        console.log("Error in logout controller : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserInfo = (req, res) => {
    try {
        const user = req.user;
        const pump = req.petrolPump || user.petrolPumpId;

        return res.status(200).json({
            id: user._id,
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            petrolPumpId: pump?._id || user.petrolPumpId,
            petrolPump: pump ? {
                id: pump._id,
                name: pump.name,
                city: pump.city,
                state: pump.state,
                address: pump.address,
                pincode: pump.pincode,
            } : null,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error in getUserInfo controller : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await User.findById(userId)
            .select('+password +tokenVersion')

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different" });
        }

        user.password = newPassword
        user.tokenVersion += 1;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" })

    } catch (error) {
        console.log("Error in changePassword controller : ", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const checkPhoneAvailability = async (req, res) => {
    try {
        const { phone } = req.body;
        const cleanPhone = (phone || "").trim();

        if (!cleanPhone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const existingUser = await User.findOne({ phone: cleanPhone });
        if (existingUser) {
            return res.status(409).json({
                available: false,
                message: "Phone number is already registered"
            });
        }

        return res.status(200).json({
            available: true,
            message: "Phone number is available"
        });
    } catch (error) {
        console.error("Error in checkPhoneAvailability controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
