import express from 'express'
import { isAuthenticated, UserSignUp,logout } from '../controllers/user.controller.js'
import { UserSignIn } from '../controllers/user.controller.js'
import { verifyEmail } from '../controllers/user.controller.js'
import { getprofile } from '../controllers/user.controller.js'
import { sendOtp } from '../controllers/user.controller.js'
import { updateProfile } from '../controllers/user.controller.js'
import { authMiddleware} from '../middlewares/Authmiddleware.js'
const router = express.Router()


router.post('/register', UserSignUp)
router.post('/login', UserSignIn)
router.post('/verifyEmail', verifyEmail)
router.get('/is-auth', isAuthenticated)
router.post('/logout',logout)
router.post('/sendOtp', sendOtp)
router.get('/profile', authMiddleware, getprofile)
router.put("/update-profile", authMiddleware, updateProfile);
export default router;
