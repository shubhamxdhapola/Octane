import express from 'express'
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { changePassword, checkPhoneAvailability, getUserInfo, login, logout, register } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { changePasswordSchema, checkPhoneSchema, loginSchema, registerOwnerSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/check-phone',
    validate(checkPhoneSchema),
    checkPhoneAvailability
)

router.post('/logout', logout)
router.get('/get-user-info', authenticate, getUserInfo)

router.post('/register',
    validate(registerOwnerSchema),
    register
)

router.post('/login', 
    validate(loginSchema), 
    login
)

router.patch('/change-password', 
    authenticate, 
    validate(changePasswordSchema), 
    changePassword
)

export default router