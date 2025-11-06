import { Project } from '../models/model.js';

export const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Project data not found" });

        }
        const newProject = new Project({
            title: title,
            description: description,
        });
        await newProject.save();
        res.status(201).json({ message: 'Project added successfully' });

    }
    catch (err) {
        res.status(404).json({ err: err.message });
    }
}


export const getAllProjects = async (req, res) => {
    try {
        const allProjects = await Project.find();
        if (!allProjects) {

            return res.status(400).json({ message: "Project data not found" });
        }
        res.status(200).json(allProjects);
    }
    catch (err) {
        res.status(404).json({ err: err.message });
    }

}

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) {

            return res.status(400).json({ message: "Project  not found" });
        }
        res.status(200).json(project);
    }
    catch (err) {
        res.status(404).json({ err: err.message });
    }

}

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { title, description,  status },
            { new: true } // return updated document
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

