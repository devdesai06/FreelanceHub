import { placeBid } from '../controllers/bid.controller.js'
import express from 'express'
const router = express.Router()


router.post('/placeBid/:projectId', placeBid)
export default router;
