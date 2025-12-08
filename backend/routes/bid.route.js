import { getBids, placeBid,acceptBid } from '../controllers/bid.controller.js'
import express from 'express'
const router = express.Router()


router.post('/placeBid/:projectId', placeBid)
router.get('/getBid/:projectId', getBids)
router.post("/accept/:bidId", acceptBid);
export default router;
