import { placeBid } from '../controllers/bid.controller.js'
import { getBidsForProject } from '../controllers/bid.controller.js'
import express from 'express'
const router = express.Router()


router.post('/placeBid/:projectId', placeBid)
router.get('/getProjects/:projectId', getBidsForProject)
export default router;
