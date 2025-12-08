import express from 'express'
import { createProject } from '../controllers/project.controller.js'
import { getProjectById } from '../controllers/project.controller.js'
import { updateProject } from '../controllers/project.controller.js'
import { deleteProject } from '../controllers/project.controller.js'
import { projectAuth } from '../middlewares/projectAuth.js'
import { getProjects } from '../controllers/project.controller.js'
import { getProjectByUser } from '../controllers/project.controller.js'
import { searchProjects } from '../controllers/project.controller.js'
import { getAssignedProjects } from '../controllers/project.controller.js'
const router = express.Router()

router.get('/getProjectsByUser', projectAuth, getProjectByUser)
router.post('/createProject', projectAuth, createProject)
router.get('/getProjectById/:id', getProjectById)
router.get('/getProjects', getProjects)
router.get('/searchProjects', searchProjects)
router.put('/updateProject/:id', updateProject)
router.delete('/deleteProject/:id', deleteProject)
router.get("/assigned/:freelancerId", getAssignedProjects);

export default router;
