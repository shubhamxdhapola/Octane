import express from "express";
import { authenticate, isAdmin } from "../middlewares/authenticate.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updatePetrolPumpSchema } from "../validations/petrol.pump.validation.js";
import {
  getPetrolPumpProfile,
  updatePetrolPumpProfile,
} from "../controllers/petrol.pump.controller.js";

const router = express.Router();

router.get("/profile", authenticate, getPetrolPumpProfile);
router.patch(
  "/profile",
  authenticate,
  isAdmin,
  validate(updatePetrolPumpSchema),
  updatePetrolPumpProfile
);
router.put(
  "/profile",
  authenticate,
  isAdmin,
  validate(updatePetrolPumpSchema),
  updatePetrolPumpProfile
);

export default router;
