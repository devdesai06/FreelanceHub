import express from 'express'
import { createProject } from '../controllers/project.controller.js'
import { getAllProjects } from '../controllers/project.controller.js'
import { getProjectById } from '../controllers/project.controller.js'
import { updateProject } from '../controllers/project.controller.js'
import { deleteProject } from '../controllers/project.controller.js'

const router = express.Router()


router.post('/createProject', createProject)
router.get('/getProjects', getAllProjects)
router.get('/getProjectById/:id', getProjectById)
router.put('/updateProject/:id', updateProject)
router.delete('/deleteProject/:id', deleteProject)
export default router;
