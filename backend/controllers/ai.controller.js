import { chatWithAI } from "../services/ai.service.js";

export const chat = async (req, res) => {
    try {
        const { message } = req.body;
        const petrolPumpId = req.user.petrolPumpId;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const reply = await chatWithAI(message, petrolPumpId);

        return res.status(200).json({ reply });
    } catch (error) {
        console.error("Error in chat ai controller : ", error);
        return res.status(500).json({ message: error?.message || "Internal server error" });
    }
};